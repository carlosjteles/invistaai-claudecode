const formatPrice = (v) =>
	new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** "2026-11-02" -> "nov/26" */
const mesAno = (iso) => {
	const [a, m] = String(iso).slice(0, 10).split("-");
	return `${MESES[Number(m) - 1]}/${a.slice(2)}`;
};
/** "2026-11-02" -> "02/11/2026" */
const dataBr = (iso) => String(iso).slice(0, 10).split("-").reverse().join("/");

/**
 * Histórico do preço "a partir de" do imóvel, gravado a cada atualização semanal da tabela.
 * Só aparece quando o preço já mudou pelo menos uma vez.
 */
export default function PriceHistory({ historico = [], tabelaEm = null }) {
	const pontos = historico
		.map((h) => ({ data: String(h.data).slice(0, 10), preco: Number(h.preco) }))
		.filter((h) => h.preco > 0);
	const mudou = new Set(pontos.map((p) => p.preco)).size > 1;

	if (!mudou) return null;

	const primeiro = pontos[0];
	const ultimo = pontos[pontos.length - 1];
	const variacao = ((ultimo.preco - primeiro.preco) / primeiro.preco) * 100;
	const sinal = variacao > 0 ? "+" : "";

	// Gráfico em degraus (o preço vale até a próxima mudança), em SVG puro
	const W = 600, H = 170, PX = 8, PT = 14, PB = 26;
	const t0 = Date.parse(primeiro.data);
	const t1 = Math.max(Date.parse(ultimo.data), t0 + 86400000);
	const min = Math.min(...pontos.map((p) => p.preco));
	const max = Math.max(...pontos.map((p) => p.preco));
	const folga = (max - min) * 0.15 || max * 0.02;
	const x = (d) => PX + ((Date.parse(d) - t0) / (t1 - t0)) * (W - 2 * PX);
	const y = (v) => PT + (1 - (v - (min - folga)) / (max + folga - (min - folga))) * (H - PT - PB);
	let caminho = `M${x(primeiro.data).toFixed(1)},${y(primeiro.preco).toFixed(1)}`;
	for (let i = 1; i < pontos.length; i++) {
		caminho += ` H${x(pontos[i].data).toFixed(1)} V${y(pontos[i].preco).toFixed(1)}`;
	}

	return (
		<div className="historico-preco mt-4">
			<h2 className="h4 mb-2">Histórico de preço</h2>
			<p className="text-muted mb-3">
				Desde {mesAno(primeiro.data)}, o preço inicial foi de {formatPrice(primeiro.preco)} para{" "}
				<strong className="text-dark">{formatPrice(ultimo.preco)}</strong>{" "}
				<span className={variacao >= 0 ? "hp-alta" : "hp-baixa"}>
					({sinal}
					{variacao.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%)
				</span>
				.
			</p>
			<svg
				viewBox={`0 0 ${W} ${H}`}
				className="w-100 h-auto"
				role="img"
				aria-label={`Preço a partir de ${formatPrice(primeiro.preco)} em ${mesAno(primeiro.data)} e ${formatPrice(ultimo.preco)} em ${mesAno(ultimo.data)}`}
			>
				<line x1={PX} x2={W - PX} y1={H - PB} y2={H - PB} className="hp-eixo" />
				<path d={caminho} className="hp-linha" fill="none" />
				{pontos.map((p) => (
					<circle key={p.data} cx={x(p.data)} cy={y(p.preco)} r="4" className="hp-ponto">
						<title>{`${dataBr(p.data)}: ${formatPrice(p.preco)}`}</title>
					</circle>
				))}
				<text x={PX} y={H - 6} className="hp-rotulo">{mesAno(primeiro.data)}</text>
				<text x={W - PX} y={H - 6} textAnchor="end" className="hp-rotulo">{mesAno(ultimo.data)}</text>
			</svg>
			<p className="small text-muted mb-0 mt-2">
				Preço da unidade mais barata disponível, conferido toda semana na tabela da incorporadora
				{tabelaEm ? ` (última tabela: ${tabelaEm})` : ""}. Ele também muda quando a unidade mais barata é
				vendida.
			</p>
		</div>
	);
}
