/**
 * Data da última mudança no template das páginas.
 *
 * O <lastmod> do sitemap é o sinal que o Google usa para decidir o que vale a
 * pena rastrear de novo. Quando muda o CONTEÚDO de um imóvel, a data vem do
 * updatedAt dele. Mas quando muda o TEMPLATE — schema, títulos, blocos novos —
 * a página também mudou, e o updatedAt não enxerga isso.
 *
 * Atualize esta data sempre que um deploy alterar o que aparece nas páginas.
 * Não mexa nela em ajuste interno que não muda nada visível nem no HTML: dizer
 * que mudou quando não mudou faz o Google parar de confiar no campo.
 *
 * 2026-11-07: schema rico (ApartmentComplex, FloorPlan, FAQPage, autoria e
 *             datas), distâncias até metrô e polos, perguntas de preço e
 *             localização, títulos com metragem e dormitórios.
 */
export const TEMPLATE_ATUALIZADO_EM = new Date("2026-11-07T00:00:00.000Z");

/**
 * A mais recente entre a data do conteúdo e a do template, sem passar de agora.
 */
export function lastmodDe(dataConteudo) {
	const agora = Date.now();
	const candidatas = [TEMPLATE_ATUALIZADO_EM.getTime()];

	const t = dataConteudo ? new Date(dataConteudo).getTime() : NaN;
	if (Number.isFinite(t)) candidatas.push(t);

	return new Date(Math.min(agora, Math.max(...candidatas))).toISOString();
}
