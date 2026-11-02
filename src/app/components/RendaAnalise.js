import Link from "next/link";

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

const brl = (v) =>
	new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);
const mil = (v) => `R$ ${(v / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mil/m²`;
const distTxt = (m) =>
	Math.round(m / 50) * 50 < 1000 ? `${Math.max(50, Math.round(m / 50) * 50)} m` : `${(m / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`;
const minutosAPe = (m) => Math.max(1, Math.round((m * 1.3) / 80));
const mesAno = (iso) => {
	const [a, m] = String(iso || "").split("-");
	return a && m ? `${MESES[Number(m) - 1]} de ${a}` : "";
};
const entregaTxt = (d) => {
	const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d || "");
	return m ? `${MESES[Number(m[2]) - 1]} de ${m[3]}` : null;
};
const NOME_UNIDADE = { Studio: "studio", Loft: "loft", Garden: "garden", Apartamento: "apartamento" };

const CONVENCAO = {
	permitida: ["Permitida", "A convenção permite locação de curta temporada (Airbnb e similares)."],
	com_operadora: ["Permitida com operadora", "A locação de curta temporada é feita por meio da operadora ou do pool de locação do condomínio."],
	proibida: ["Não permitida", "A convenção não permite locação de curta temporada; a unidade serve para locação tradicional."],
};

/**
 * Bloco de análise para quem compra para alugar (studios, lofts e NR): dados próprios de cada imóvel,
 * calculados pela localização e pelas plantas — metrô, polos de demanda, m² x bairro e convenção.
 */
export default function RendaAnalise({ analise, nome, category, deliveryIn, phone }) {
	if (!analise) return null;
	const { metro, polos = [], unidades = [], indice, convencao, nr } = analise;

	const compacta = unidades[0];
	const pm2 = compacta ? Number(compacta.price) / Number(compacta.private_area) : 0;
	const mediana = Number(indice?.mediana) || 0;
	const dif = pm2 && mediana ? Math.round((pm2 / mediana - 1) * 100) : null;
	const conv = convencao && CONVENCAO[convencao.status];
	const entrega = category !== 4 ? entregaTxt(deliveryIn) : null;
	const estacao = metro?.nome?.replace(/^Metrô /, "estação ").replace(/^Estação /, "estação ");

	const pedido = `Olá! Tenho interesse em comprar uma unidade do ${nome} para alugar. Pode me enviar um estudo de rentabilidade e confirmar as regras de locação por temporada?`;

	return (
		<div className="renda-analise imovel-bloco mt-4">
			<h2 className="h4 mb-3">Análise para quem compra para alugar</h2>

			{metro && (
				<p>
					{metro.dist <= 1500 ? (
						<>
							O {nome} fica a cerca de {distTxt(metro.dist)} em linha reta da {estacao}, uns {minutosAPe(metro.dist)}{" "}
							minutos a pé. Estar perto do metrô é um dos fatores que mais pesam na ocupação de studios e unidades
							compactas.
						</>
					) : (
						<>
							A estação de metrô mais próxima é a {estacao}, a cerca de {distTxt(metro.dist)} em linha reta.
						</>
					)}
				</p>
			)}

			{polos.length > 0 && (
				<>
					<p className="mb-2">Polos que geram procura por aluguel na região (distância em linha reta):</p>
					<ul>
						{polos.map((p) => (
							<li key={p.nome}>
								<strong>{p.nome}</strong> ({p.tipo}): {distTxt(p.dist)}
							</li>
						))}
					</ul>
				</>
			)}

			{compacta && (
				<p>
					A unidade compacta de menor preço é {NOME_UNIDADE[compacta.type] ? `um ${NOME_UNIDADE[compacta.type]}` : "uma unidade"} de{" "}
					{Math.round(compacta.private_area)} m², a partir de {brl(Number(compacta.price))}, cerca de {mil(pm2)}.
					{mediana > 0 && (
						<>
							{" "}
							No{" "}
							<Link href="/indice-preco-m2" className="text-primary">
								Índice de preço do m²
							</Link>{" "}
							de {mesAno(indice.mes)}, a mediana dos imóveis novos no bairro {indice.bairro} é de {mil(mediana)}
							{indice.n ? ` (${indice.n} empreendimentos)` : ""}
							{dif !== null &&
								(Math.abs(dif) < 5
									? ", praticamente o mesmo valor."
									: dif > 0
									? `; esta unidade custa cerca de ${dif}% a mais por m², o que é comum em unidades compactas.`
									: `; esta unidade custa cerca de ${Math.abs(dif)}% a menos por m².`)}
						</>
					)}
				</p>
			)}

			<p className="mb-2">
				<span className="imovel-rotulo d-inline me-1">Locação de curta temporada:</span>
				<strong>{conv ? conv[0] : "a confirmar"}</strong>
			</p>
			<p>
				{conv
					? `${conv[1]}${convencao.obs ? ` ${convencao.obs}` : ""} Informação conferida pela nossa equipe em ${convencao.em}.`
					: nr
					? "Por ser uma unidade NR (não residencial), o projeto costuma prever uso para hospedagem e serviços, mas a permissão para Airbnb e similares depende da convenção do condomínio. Nossa equipe confere a regra deste empreendimento para você."
					: "Em condomínio residencial, a locação por curta temporada só é possível se a convenção autorizar de forma expressa (entendimento do STJ de maio de 2026). Nossa equipe confere a regra deste empreendimento antes da compra."}
			</p>

			{entrega && (
				<p>
					A entrega está prevista para {entrega}. A renda com aluguel começa depois das chaves e da montagem da
					unidade; até lá, as parcelas da obra são corrigidas pelo INCC.
				</p>
			)}

			<a
				href={`https://wa.me/${phone}?text=${encodeURIComponent(pedido)}`}
				target="_blank"
				rel="noopener noreferrer"
				className="btn btn-soft-primary mt-1"
			>
				Pedir estudo de rentabilidade
			</a>
		</div>
	);
}
