import { notFound } from "next/navigation";
import prisma from "../../db/prisma";

// Painel interno, fora do índice e protegido por chave na URL. Lê o histórico
// do Search Console que a coleta diária grava no schema `seo`.
export const metadata = {
	title: "Painel SEO",
	robots: { index: false, follow: false },
	alternates: { canonical: null },
};

export const dynamic = "force-dynamic";

const n = (v) => Number(v ?? 0).toLocaleString("pt-BR");
const dec = (v, c = 1) =>
	v === null || v === undefined
		? "—"
		: Number(v).toLocaleString("pt-BR", { minimumFractionDigits: c, maximumFractionDigits: c });

/** Variação percentual entre dois períodos, já formatada. */
function variacao(agora, antes) {
	if (!antes) return { texto: "—", sinal: "neutro" };
	const d = ((agora - antes) / antes) * 100;
	const sinal = d > 1 ? "alta" : d < -1 ? "baixa" : "neutro";
	return { texto: `${d > 0 ? "+" : ""}${dec(d)}%`, sinal };
}

export default async function PainelSeo({ searchParams }) {
	const chaveInformada = searchParams?.chave || "";
	const [cfg] = await prisma.$queryRaw`
		select valor from conteudo.config where chave = 'painel_chave'`;
	if (!cfg?.valor || chaveInformada !== cfg.valor) notFound();

	const [periodo] = await prisma.$queryRaw`
		select
			coalesce(sum(cliques) filter (where data > current_date - 28), 0)::int cliques,
			coalesce(sum(impressoes) filter (where data > current_date - 28), 0)::int impressoes,
			coalesce(sum(cliques) filter (where data between current_date - 56 and current_date - 29), 0)::int cliques_antes,
			coalesce(sum(impressoes) filter (where data between current_date - 56 and current_date - 29), 0)::int impressoes_antes,
			round(sum(posicao * impressoes) filter (where data > current_date - 28)
				/ nullif(sum(impressoes) filter (where data > current_date - 28), 0), 1) posicao,
			round(sum(posicao * impressoes) filter (where data between current_date - 56 and current_date - 29)
				/ nullif(sum(impressoes) filter (where data between current_date - 56 and current_date - 29), 0), 1) posicao_antes
		from seo.consulta_dia`;

	const indexacao = await prisma.$queryRaw`
		select coalesce(cobertura, 'Sem dado') situacao, count(*)::int paginas
		from seo.inspecao group by 1 order by 2 desc`;

	const oportunidades = await prisma.$queryRaw`
		select consulta, sum(impressoes)::int impressoes, sum(cliques)::int cliques,
			round(sum(posicao * impressoes) / nullif(sum(impressoes), 0), 1) posicao
		from seo.consulta_dia where data > current_date - 90
		group by consulta having sum(impressoes) >= 10
			and round(sum(posicao * impressoes) / nullif(sum(impressoes), 0), 1) between 5 and 20
		order by sum(impressoes) desc limit 15`;

	const semClique = await prisma.$queryRaw`
		select consulta, sum(impressoes)::int impressoes,
			round(sum(posicao * impressoes) / nullif(sum(impressoes), 0), 1) posicao
		from seo.consulta_dia where data > current_date - 90
		group by consulta having sum(cliques) = 0 and sum(impressoes) >= 20
		order by sum(impressoes) desc limit 15`;

	const paginasTop = await prisma.$queryRaw`
		select pagina, sum(impressoes)::int impressoes, sum(cliques)::int cliques,
			round(sum(posicao * impressoes) / nullif(sum(impressoes), 0), 1) posicao
		from seo.consulta_dia where data > current_date - 90
		group by pagina order by sum(impressoes) desc limit 15`;

	const [coleta] = await prisma.$queryRaw`
		select max(data)::text ate, min(data)::text desde, count(*)::int linhas
		from seo.consulta_dia`;
	const [inspecionado] = await prisma.$queryRaw`
		select max(verificado_em) em, count(*)::int total from seo.inspecao`;

	const vImpr = variacao(periodo.impressoes, periodo.impressoes_antes);
	const vCliq = variacao(periodo.cliques, periodo.cliques_antes);
	const ctr = periodo.impressoes ? (periodo.cliques / periodo.impressoes) * 100 : 0;
	const ctrAntes = periodo.impressoes_antes
		? (periodo.cliques_antes / periodo.impressoes_antes) * 100
		: 0;
	const vCtr = variacao(ctr, ctrAntes);
	// Em posição, número menor é melhor, então a leitura inverte.
	const vPos = variacao(periodo.posicao_antes, periodo.posicao);

	const curto = (u) => String(u).replace("https://www.invistaai.com", "") || "/";

	return (
		<>
			<style>{`
				.psq { --tinta:#22303F; --suave:#6B7684; --linha:#E4DFD6; --papel:#fff;
					--fundo:#F7F5F1; --navy:#1E3A5F; --champ:#B08D57; --alta:#15803D; --baixa:#B45309;
					background:var(--fundo); color:var(--tinta); min-height:100vh; padding:28px 16px 64px;
					font-family:system-ui,-apple-system,sans-serif; }
				.psq .dentro { max-width:1040px; margin:0 auto; }
				.psq h1 { font-size:26px; margin:0 0 4px; color:var(--navy); }
				.psq .meta { color:var(--suave); font-size:13px; margin:0 0 24px; }
				.psq h2 { font-size:13px; letter-spacing:.12em; text-transform:uppercase;
					color:var(--champ); margin:32px 0 10px; font-weight:600; }
				.psq .cartoes { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; }
				.psq .cartao { background:var(--papel); border:1px solid var(--linha); border-radius:10px; padding:16px; }
				.psq .cartao .r { font-size:12px; color:var(--suave); }
				.psq .cartao .v { font-size:26px; font-weight:600; margin:4px 0 2px; font-variant-numeric:tabular-nums; }
				.psq .d { font-size:12px; font-weight:600; }
				.psq .alta { color:var(--alta); } .psq .baixa { color:var(--baixa); } .psq .neutro { color:var(--suave); }
				.psq table { width:100%; border-collapse:collapse; background:var(--papel);
					border:1px solid var(--linha); border-radius:10px; overflow:hidden; font-variant-numeric:tabular-nums; }
				.psq th, .psq td { padding:10px 14px; border-bottom:1px solid var(--linha);
					text-align:right; font-size:14px; }
				.psq th { font-size:11px; letter-spacing:.1em; text-transform:uppercase;
					color:var(--suave); background:#FBFAF7; }
				.psq th:first-child, .psq td:first-child { text-align:left; }
				.psq tbody tr:last-child td { border-bottom:0; }
				.psq td a { color:var(--navy); text-decoration:none; }
				.psq .nota { color:var(--suave); font-size:13px; margin:8px 0 0; }
				@media (max-width:640px){ .psq td,.psq th{ padding:8px 10px; font-size:13px; } }
			`}</style>

			<div className="psq">
				<div className="dentro">
					<h1>Painel SEO</h1>
					<p className="meta">
						Dados do Search Console de {coleta?.desde} a {coleta?.ate} · {n(coleta?.linhas)} registros ·
						{" "}{n(inspecionado?.total)} páginas inspecionadas
						{inspecionado?.em
							? ` em ${new Date(inspecionado.em).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}`
							: ""}
					</p>

					<h2>Últimos 28 dias, contra os 28 anteriores</h2>
					<div className="cartoes">
						<div className="cartao">
							<div className="r">Impressões</div>
							<div className="v">{n(periodo.impressoes)}</div>
							<div className={`d ${vImpr.sinal}`}>{vImpr.texto}</div>
						</div>
						<div className="cartao">
							<div className="r">Cliques</div>
							<div className="v">{n(periodo.cliques)}</div>
							<div className={`d ${vCliq.sinal}`}>{vCliq.texto}</div>
						</div>
						<div className="cartao">
							<div className="r">CTR</div>
							<div className="v">{dec(ctr)}%</div>
							<div className={`d ${vCtr.sinal}`}>{vCtr.texto}</div>
						</div>
						<div className="cartao">
							<div className="r">Posição média</div>
							<div className="v">{dec(periodo.posicao)}</div>
							<div className={`d ${vPos.sinal}`}>{vPos.texto}</div>
						</div>
					</div>

					<h2>Indexação das 382 páginas</h2>
					<table>
						<thead><tr><th>Situação</th><th>Páginas</th></tr></thead>
						<tbody>
							{indexacao.map((i) => (
								<tr key={i.situacao}><td>{i.situacao}</td><td>{n(i.paginas)}</td></tr>
							))}
						</tbody>
					</table>
					<p className="nota">
						&quot;Detectada, mas não indexada&quot; quer dizer que o Google conhece a URL e ainda
						não foi rastreá-la. É prioridade de rastreamento, não defeito da página.
					</p>

					<h2>Perto da primeira página</h2>
					<table>
						<thead><tr><th>Consulta</th><th>Impressões</th><th>Cliques</th><th>Posição</th></tr></thead>
						<tbody>
							{oportunidades.length === 0 && (
								<tr><td colSpan={4}>Nenhuma consulta nessa faixa ainda.</td></tr>
							)}
							{oportunidades.map((o) => (
								<tr key={o.consulta}>
									<td>{o.consulta}</td><td>{n(o.impressoes)}</td>
									<td>{n(o.cliques)}</td><td>{dec(o.posicao)}</td>
								</tr>
							))}
						</tbody>
					</table>
					<p className="nota">Já aparecem na busca e precisam de empurrão, não de página nova.</p>

					<h2>Aparece e ninguém clica</h2>
					<table>
						<thead><tr><th>Consulta</th><th>Impressões</th><th>Posição</th></tr></thead>
						<tbody>
							{semClique.length === 0 && (
								<tr><td colSpan={3}>Nada acima do limite.</td></tr>
							)}
							{semClique.map((s) => (
								<tr key={s.consulta}>
									<td>{s.consulta}</td><td>{n(s.impressoes)}</td><td>{dec(s.posicao)}</td>
								</tr>
							))}
						</tbody>
					</table>
					<p className="nota">
						Zero clique em posição boa costuma ser título ou descrição que não convencem,
						ou intenção de busca que a página não atende.
					</p>

					<h2>Páginas com mais impressões</h2>
					<table>
						<thead><tr><th>Página</th><th>Impressões</th><th>Cliques</th><th>Posição</th></tr></thead>
						<tbody>
							{paginasTop.map((p) => (
								<tr key={p.pagina}>
									<td><a href={p.pagina} rel="nofollow">{curto(p.pagina)}</a></td>
									<td>{n(p.impressoes)}</td><td>{n(p.cliques)}</td><td>{dec(p.posicao)}</td>
								</tr>
							))}
						</tbody>
					</table>

					<p className="nota" style={{ marginTop: 28 }}>
						Os dados do Google têm 2 a 3 dias de atraso. A coleta roda todo dia às 11h12 e
						regrava os dias recentes, porque eles ainda mudam depois de publicados.
					</p>
				</div>
			</div>
		</>
	);
}
