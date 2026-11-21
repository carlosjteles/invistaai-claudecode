-- ============================================================
-- conteudo.indicadores + conteudo.copom_calendario
-- Faixa de indicadores de mercado do invistaai
--
-- Regras seguidas:
--  * nenhum valor inventado: cada linha guarda fonte, URL e mes de referencia
--  * se a API do BCB falhar, o valor anterior PERMANECE (registra erro_em/erro_msg)
--  * o site le somente desta tabela; nunca chama o BCB no request do usuario
-- ============================================================

create table if not exists conteudo.indicadores (
    chave         text primary key,
    rotulo        text        not null,
    valor_num     numeric,
    valor_texto   text,
    detalhe       text,                       -- vai no title: "out/2026: 0,35% no mes"
    url           text,                       -- link opcional do item (post do indice)
    unidade       text        not null default 'percentual',
    referencia    text,                       -- "out/2026", "meta vigente"
    fonte         text        not null,
    fonte_url     text        not null,
    ordem         integer     not null default 100,
    ativo         boolean     not null default true,
    atualizado_em timestamptz,
    erro_em       timestamptz,
    erro_msg      text
);

comment on table conteudo.indicadores is
    'Indicadores exibidos na faixa do site. valor_texto e o que aparece na tela.';
comment on column conteudo.indicadores.erro_em is
    'Ultima falha de coleta. valor_num/valor_texto continuam com o ultimo valor bom.';

-- ------------------------------------------------------------
-- Calendario do Copom: o BCB publica em pagina/PDF, nao ha
-- endpoint JSON (testei /api/servico/sitebcb/copomdatas e
-- /agendacopom: HTTP 400). Entao as datas ficam semeadas aqui,
-- conferidas no calendario oficial. O BCB divulga o ano seguinte
-- ate junho, e a funcao avisa quando o calendario esta acabando.
-- ------------------------------------------------------------
create table if not exists conteudo.copom_calendario (
    data_decisao date primary key,            -- 2o dia da reuniao (dia da decisao)
    data_inicio  date not null,
    fonte_url    text not null default 'https://www.bcb.gov.br/publicacoes/atascopom'
);

insert into conteudo.copom_calendario (data_inicio, data_decisao) values
    ('2026-12-08','2026-12-09'),
    ('2027-01-26','2027-01-27'),
    ('2027-03-16','2027-03-17'),
    ('2027-04-27','2027-04-28'),
    ('2027-06-15','2027-06-16'),
    ('2027-08-03','2027-08-04'),
    ('2027-09-21','2027-09-22'),
    ('2027-10-26','2027-10-27'),
    ('2027-12-07','2027-12-08')
on conflict (data_decisao) do nothing;

-- ------------------------------------------------------------
-- Linhas base. valor_texto fica nulo ate a 1a coleta: a faixa
-- nao renderiza indicador sem valor, em vez de mostrar zero.
-- ------------------------------------------------------------
insert into conteudo.indicadores (chave, rotulo, unidade, fonte, fonte_url, ordem) values
    ('selic_meta',   'Selic',      'percentual', 'Banco Central — SGS 432',
     'https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json', 10),
    ('ipca_12m',     'IPCA 12m',   'percentual', 'IBGE/Banco Central — SGS 13522',
     'https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/1?formato=json', 20),
    ('incc_m_12m',   'INCC-M 12m', 'percentual', 'FGV/Banco Central — SGS 7456 (12 meses compostos)',
     'https://api.bcb.gov.br/dados/serie/bcdata.sgs.7456/dados/ultimos/12?formato=json', 30),
    ('copom_proxima','Próximo Copom','data',     'Banco Central — calendário do Copom',
     'https://www.bcb.gov.br/publicacoes/atascopom', 90)
on conflict (chave) do nothing;

-- ============================================================
-- Coleta
-- ============================================================

-- mes de referencia em pt-BR ("out/2026")
create or replace function conteudo.mes_pt(d date)
returns text language sql immutable as $$
    select (array['jan','fev','mar','abr','mai','jun',
                  'jul','ago','set','out','nov','dez'])[extract(month from d)::int]
           || '/' || extract(year from d)::text;
$$;

create or replace function conteudo.atualizar_indicadores()
returns table (chave text, valor_texto text, situacao text)
language plpgsql
security definer
set search_path = conteudo, extensions, pg_catalog
as $$
declare
    v_hoje    date := (now() at time zone 'America/Sao_Paulo')::date;
    v_json    jsonb;
    v_val     numeric;
    v_data    date;
    v_n       integer;
    v_mes     numeric;
    v_erro    text;
begin
    perform extensions.http_set_curlopt('CURLOPT_TIMEOUT', '30');

    -- ---------- 1) Selic meta (serie 432, valor diario) ----------
    begin
        select content::jsonb into v_json
          from extensions.http_get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json');

        select replace(e->>'valor', ',', '.')::numeric,
               to_date(e->>'data', 'DD/MM/YYYY')
          into v_val, v_data
          from jsonb_array_elements(v_json) e limit 1;

        if v_val is null or v_val <= 0 then
            raise exception 'valor invalido: %', coalesce(v_val::text, 'null');
        end if;

        update conteudo.indicadores i set
            valor_num     = v_val,
            valor_texto   = replace(to_char(v_val, 'FM990.00'), '.', ',') || '%',
            detalhe       = 'Meta da taxa Selic definida pelo Copom, ao ano',
            referencia    = 'meta vigente',
            atualizado_em = now(),
            erro_em = null, erro_msg = null
          where i.chave = 'selic_meta';
    exception when others then
        v_erro := sqlerrm;
        update conteudo.indicadores i
           set erro_em = now(), erro_msg = left(v_erro, 300)
         where i.chave = 'selic_meta';
    end;

    -- ---------- 2) IPCA acumulado 12 meses (serie 13522) ----------
    begin
        select content::jsonb into v_json
          from extensions.http_get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/1?formato=json');

        select replace(e->>'valor', ',', '.')::numeric,
               to_date(e->>'data', 'DD/MM/YYYY')
          into v_val, v_data
          from jsonb_array_elements(v_json) e limit 1;

        if v_val is null then
            raise exception 'valor nulo';
        end if;

        update conteudo.indicadores i set
            valor_num     = v_val,
            valor_texto   = replace(to_char(v_val, 'FM990.00'), '.', ',') || '%',
            detalhe       = 'IPCA acumulado em 12 meses até ' || conteudo.mes_pt(v_data),
            referencia    = conteudo.mes_pt(v_data),
            atualizado_em = now(),
            erro_em = null, erro_msg = null
          where i.chave = 'ipca_12m';
    exception when others then
        v_erro := sqlerrm;
        update conteudo.indicadores i
           set erro_em = now(), erro_msg = left(v_erro, 300)
         where i.chave = 'ipca_12m';
    end;

    -- ---------- 3) INCC-M 12 meses ----------
    -- A serie 7456 devolve a variacao MENSAL (0,35 em out/2026), nao a
    -- acumulada. O acumulado 12m sai compondo os 12 ultimos meses:
    -- (prod(1+v/100) - 1) * 100. Conferido: 6,75% em out/2026.
    begin
        select content::jsonb into v_json
          from extensions.http_get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.7456/dados/ultimos/12?formato=json');

        select count(*), max(to_date(e->>'data', 'DD/MM/YYYY')),
               round((exp(sum(ln(1 + replace(e->>'valor', ',', '.')::numeric / 100.0))) - 1) * 100, 2)
          into v_n, v_data, v_val
          from jsonb_array_elements(v_json) e;

        -- sem os 12 meses completos o acumulado estaria errado: aborta e mantem o anterior
        if v_n <> 12 or v_val is null then
            raise exception 'esperava 12 meses, recebi %', v_n;
        end if;

        -- variacao do ultimo mes, do mesmo payload: vai no detalhe (title)
        select replace(e->>'valor', ',', '.')::numeric into v_mes
          from jsonb_array_elements(v_json) e
         where to_date(e->>'data', 'DD/MM/YYYY') = v_data;

        update conteudo.indicadores i set
            valor_num     = v_val,
            valor_texto   = replace(to_char(v_val, 'FM990.00'), '.', ',') || '%',
            detalhe       = conteudo.mes_pt(v_data) || ': '
                            || replace(to_char(v_mes, 'FM990.00'), '.', ',')
                            || '% no mês — índice que corrige o saldo devedor na planta',
            referencia    = conteudo.mes_pt(v_data),
            atualizado_em = now(),
            erro_em = null, erro_msg = null
          where i.chave = 'incc_m_12m';
    exception when others then
        v_erro := sqlerrm;
        update conteudo.indicadores i
           set erro_em = now(), erro_msg = left(v_erro, 300)
         where i.chave = 'incc_m_12m';
    end;

    -- ---------- 4) Proxima reuniao do Copom ----------
    select min(c.data_decisao) into v_data
      from conteudo.copom_calendario c
     where c.data_decisao >= v_hoje;

    if v_data is null then
        update conteudo.indicadores i set
            ativo   = false,
            erro_em = now(),
            erro_msg = 'calendario do Copom esgotado: semear as datas do proximo ano'
          where i.chave = 'copom_proxima';
    else
        update conteudo.indicadores i set
            valor_num     = null,
            valor_texto   = to_char(v_data, 'DD/MM/YYYY'),
            detalhe       = 'Data da próxima decisão de juros do Comitê de Política Monetária',
            referencia    = null,
            ativo         = true,
            atualizado_em = now(),
            erro_em = null, erro_msg = null
          where i.chave = 'copom_proxima';

        -- avisa com antecedencia que o calendario vai acabar
        if (select max(c.data_decisao) from conteudo.copom_calendario c) < v_hoje + 120 then
            update conteudo.indicadores i
               set erro_msg = 'calendario do Copom termina em menos de 120 dias'
             where i.chave = 'copom_proxima';
        end if;
    end if;

    return query
      select i.chave, i.valor_texto,
             case when i.erro_em is null then 'ok' else 'erro: ' || i.erro_msg end
        from conteudo.indicadores i order by i.ordem;
end $$;

-- ============================================================
-- Leitura pelo site (anon): somente indicadores ativos com valor
-- ============================================================
alter table conteudo.indicadores      enable row level security;
alter table conteudo.copom_calendario enable row level security;

create policy indicadores_leitura_publica on conteudo.indicadores
    for select to anon, authenticated using (ativo and valor_texto is not null);

-- ============================================================
-- Agendamento: 3x ao dia (a Selic muda no dia do Copom, os
-- indices mensais saem em dias uteis pela manha)
-- ============================================================
select cron.schedule('indicadores-mercado', '20 9,13,19 * * *',
                     'select conteudo.atualizar_indicadores()');

-- ============================================================
-- Faixa enxuta: rótulo + valor, sem a linha de referência.
-- A tabela guarda o fato (a data do Copom); a view monta o texto.
-- A contagem de dias é calculada a cada leitura, para não ficar
-- desatualizada se a coleta falhar num dia.
-- ============================================================
update conteudo.indicadores set rotulo = 'Copom' where chave = 'copom_proxima';

create or replace view conteudo.indicadores_faixa as
with copom as (
    select c.data_decisao,
           c.data_decisao - (now() at time zone 'America/Sao_Paulo')::date as dias
      from conteudo.copom_calendario c
     where c.data_decisao >= (now() at time zone 'America/Sao_Paulo')::date
     order by c.data_decisao
     limit 1
)
select
    i.chave,
    i.rotulo,
    case
        when i.chave <> 'copom_proxima' then i.valor_texto
        else (select case dias when 0 then 'hoje'
                               when 1 then 'amanhã'
                               else 'em ' || dias || ' dias'
                     end
                from copom)
    end as valor_texto,
    -- O detalhe já nomeia o mês de referência, então não repetir aqui. No
    -- Copom a faixa mostra só a contagem, então a data precisa vir no detalhe
    -- — senão ela não aparece em lugar nenhum.
    case
        when i.chave <> 'copom_proxima' then i.detalhe
        else (select 'Próxima decisão de juros do Copom: '
                     || to_char(data_decisao, 'DD/MM/YYYY')
                from copom)
    end as detalhe,
    i.url,
    i.ordem
  from conteudo.indicadores i
 where i.ativo
   and i.valor_texto is not null;

grant select on conteudo.indicadores_faixa to anon, authenticated;

-- ============================================================
-- Segundo valor (variação do mês) visível no texto da faixa.
-- O title não serve: celular não tem hover.
--   IPCA mensal  -> série 433, conferida por consistência
--                   (compondo 12 meses dela dá os 4,63% da 13522)
--   INCC mensal  -> já vinha no payload da 7456
-- As colunas novas vão no FIM da lista da view: create or replace
-- aceita acrescentar coluna, só não aceita inserir no meio.
-- ============================================================
alter table conteudo.indicadores
    add column if not exists valor2_texto text,
    add column if not exists rotulo2      text;
