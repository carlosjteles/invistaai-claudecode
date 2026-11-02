import Link from "next/link";
import Image from "next/image";

import { FiHome, FiCamera } from "../assets/icons/vander";

const ESTAGIO = {
	1: "Breve lançamento",
	2: "Lançamento",
	3: "Em obras",
	4: "Pronto novo",
	5: "Investimento",
};
const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const brl = (v) =>
	new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

/** "30/04/2028" -> "Abr/28" */
export const entregaCurta = (d) => {
	const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d || "");
	return m ? `${MESES[Number(m[2]) - 1]}/${m[3].slice(2)}` : null;
};

/**
 * Card de imóvel usado na home, na lista, nos relacionados e nas páginas de bairro/incorporadora.
 * Nome, bairro, resumo (m², dorms, suítes, vagas), preço "a partir de" com R$/m², entrega e estágio.
 */
export default function PropertyCard({ item, className = "", destaque = null }) {
	const thumbnail = item.images?.[0] || null;
	const nome = item.name || item.address;
	const resumo = [item.preview?.area, item.preview?.bedroom, item.preview?.suite, item.preview?.parking]
		.filter(Boolean)
		.join(" · ");
	// destaque: unidade em evidência nas páginas temáticas (ex.: a cobertura), com rótulo, preço e área próprios
	const preco = destaque?.preco > 0 ? destaque.preco : item.price;
	const areaRef = destaque?.preco > 0 ? destaque.area : item.min_area;
	const precoM2 = preco > 0 && areaRef > 0 ? Math.round(preco / areaRef) : 0;
	const estagio = ESTAGIO[item.category];
	const entrega = item.category !== 4 ? entregaCurta(item.delivery_in) : null;

	return (
		<div className={`card property property-v2 border-0 shadow position-relative overflow-hidden rounded-3 ${className}`}>
			{thumbnail && (
				<div className="property-image position-relative overflow-hidden shadow">
					<Image
						src={thumbnail.src}
						width={0}
						height={0}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
						quality={60}
						className="img-fluid"
						alt={thumbnail.alt || nome}
					/>
					<ul className="list-unstyled property-icon">
						<li>
							<Link
								href={`/imovel/${item.slug}`}
								className="btn btn-sm btn-icon btn-pills btn-primary"
								aria-label={`Ver detalhes do imóvel ${nome}`}
							>
								<FiHome className="icons" aria-hidden="true" />
							</Link>
						</li>
						<li className="mt-1">
							<Link
								href={`/imovel/${item.slug}?openGallery=true`}
								className="btn btn-sm btn-icon btn-pills btn-primary"
								aria-label={`Ver galeria de fotos do imóvel ${nome}`}
							>
								<FiCamera className="icons" aria-hidden="true" />
							</Link>
						</li>
					</ul>
				</div>
			)}

			<div className="card-body content p-4">
				<Link href={`/imovel/${item.slug}`} className="title text-dark">
					{item.name}
				</Link>
				{item.neighborhood && <p className="pv2-local mb-0">{item.neighborhood}, São Paulo – SP</p>}
				{resumo && <p className="pv2-resumo mb-0">{resumo}</p>}

				<div className="pv2-rodape d-flex justify-content-between align-items-end">
					<div>
						{destaque?.rotulo && <span className="pv2-destaque">{destaque.rotulo}</span>}
						<span className="pv2-rotulo">{preco > 0 ? "A partir de" : "Preço"}</span>
						<p className="pv2-preco mb-0">{preco > 0 ? brl(preco) : "Consulte"}</p>
						{precoM2 > 0 && <span className="pv2-m2">({brl(precoM2)}/m²)</span>}
					</div>
					<div className="text-end">
						{entrega && (
							<p className="pv2-entrega mb-1">
								Entrega: <strong>{entrega}</strong>
							</p>
						)}
						{estagio && <span className={`pv2-estagio pv2-estagio-${item.category}`}>{estagio}</span>}
					</div>
				</div>
			</div>
		</div>
	);
}
