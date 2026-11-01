import Link from "next/link";
import Image from "next/image";

import { FiHome, FiCamera } from "../assets/icons/vander";

import { formatPrice } from "../helper/formatter";

/** Card de imóvel (mesmo visual dos cards da home e da lista), para páginas renderizadas no servidor. */
export default function PropertyCard({ item }) {
	const thumbnail = item.images?.[0] || null;
	const nome = item.name || item.address;

	return (
		<div className="card property border-0 shadow position-relative overflow-hidden rounded-3">
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
				<Link href={`/imovel/${item.slug}`} className="title fs-5 text-dark fw-medium">
					{item.name}
				</Link>

				<ul className="list-unstyled mt-3 mb-0 pt-3 border-top row">
					<li className="col-6 d-flex align-items-center m-0">
						<span>
							<i className="mdi mdi-arrow-expand-all fs-5 me-2 text-primary" aria-hidden="true"></i>
							<small className="text-muted">{item.preview?.area}</small>
						</span>
					</li>
					<li className="col-6 d-flex align-items-center m-0">
						<span>
							<i className="mdi mdi-bed fs-5 me-2 text-primary" aria-hidden="true"></i>
							<small className="text-muted">{item.preview?.bedroom}</small>
						</span>
					</li>
				</ul>
				<ul className="list-unstyled pb-3 pt-0 border-bottom row">
					<li className="col-6 d-flex align-items-center m-0">
						<span>
							<i className="mdi mdi-shower fs-5 me-2 text-primary" aria-hidden="true"></i>
							<small className="text-muted">{item.preview?.suite}</small>
						</span>
					</li>
					<li className="col-6 d-flex align-items-center m-0">
						<span>
							<i className="mdi mdi-car fs-5 me-2 text-primary" aria-hidden="true"></i>
							<small className="text-muted">{item.preview?.parking}</small>
						</span>
					</li>
				</ul>

				<ul className="list-unstyled d-flex justify-content-between mt-2 mb-0">
					<li className="list-inline-item mb-0">
						<span className="text-muted">Preço</span>
						<p className="fw-medium mb-0">{item.price ? formatPrice(item.price) : "Consulte"}</p>
					</li>
				</ul>
			</div>
		</div>
	);
}
