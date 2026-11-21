import { unstable_cache } from "next/cache";

import prisma from "../../db/prisma";

// A coleta do Banco Central roda no Postgres (conteudo.atualizar_indicadores,
// agendada 3x ao dia). O site só lê a tabela: nunca chama a API do BCB dentro
// do request do usuário, então uma lentidão do Banco Central não afeta a página.
async function buscar() {
	try {
		return await prisma.$queryRaw`
            select rotulo, valor_texto, detalhe, url, referencia
              from conteudo.indicadores
             where ativo and valor_texto is not null
             order by ordem
        `;
	} catch (erro) {
		// A faixa é enfeite: se a tabela não existir ou o banco falhar, ela
		// simplesmente não aparece. Em nenhuma hipótese derruba a página.
		console.error("Faixa de indicadores indisponível:", erro?.message || erro);
		return [];
	}
}

// 30 min: os índices são mensais e a Selic muda só em dia de Copom, então
// um cache longo não atrasa nada e mantém as páginas estáticas (ISR).
export const getIndicadores = unstable_cache(buscar, ["indicadores-mercado"], {
	revalidate: 1800,
	tags: ["indicadores"],
});
