import Link from "next/link";
import Image from "next/image";

import { FiHome, FiCamera } from "../assets/icons/vander";

import { formatPrice } from "../helper/formatter";
import { getBaseUrl } from "../helper/utils";

import prisma from "../../db/prisma";
import Mdi from "./Mdi";

export const revalidate = 300;

export default async function FeaturedProperties() {
	const propertyData = await prisma.property.findMany({
		where: {
			images: {
				some: {},
			},
		},
		take: 12,
		include: {
			images: {
				select: {
					id: true,
					src: true,
					alt: true,
				},
				where: {
					thumbnail: true,
				},
				take: 1,
			},
		},
		orderBy: {
			id: "desc",
		},
	});

	if (!propertyData || propertyData.length === 0) {
		return null;
	}

	return (
		<>
			<div className="row justify-content-center">
				<div className="col">
					<div className="section-title text-center mb-4 pb-2">
						<h2 className="title h4 mb-3">Imóveis em destaque</h2>
						<p className="text-muted para-desc mb-0 mx-auto">
							Veja os imóveis em destaque com localização e preço estratégicos.
						</p>
					</div>
				</div>
			</div>

			<div
				className="row g-4 mt-0"
				itemScope
				itemType="https://schema.org/ItemList"
			>
				<meta itemProp="name" content="Imóveis em destaque" />
				<meta itemProp="itemListOrder" content="Unordered" />
				<meta itemProp="numberOfItems" content={propertyData.length} />

				{propertyData.map((item, index) => {
					const thumbnail = item.images?.[0] || null;
					const itemUrl = `${getBaseUrl()}/imovel/${item.slug}`;

					return (
						<div
							className="col-lg-4 col-md-6 col-12"
							key={index}
							itemProp="itemListElement"
							itemScope
							itemType="https://schema.org/ListItem"
						>
							<meta itemProp="position" content={index + 1} />
							<meta itemProp="url" content={itemUrl} />
							<meta itemProp="name" content={item.name} />

							<div
								className="card property border-0 shadow position-relative overflow-hidden rounded-3"
							>

								{thumbnail && (
									<div className="property-image position-relative overflow-hidden shadow">
										<Image
											src={thumbnail.src}
											width={0}
											height={0}
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
											quality={60}
											className="img-fluid"
											alt={thumbnail.alt}
										/>
										<ul className="list-unstyled property-icon">
											<li>
												<Link
													href={`/imovel/${item.slug}`}
													className="btn btn-sm btn-icon btn-pills btn-primary"
													aria-label={`Ver detalhes do imóvel ${
														item.name || item.address
													}`}
												>
													<FiHome className="icons" aria-hidden="true" />
												</Link>
											</li>
											<li className="mt-1">
												<Link
													href={`/imovel/${item.slug}?openGallery=true`}
													className="btn btn-sm btn-icon btn-pills btn-primary"
													aria-label={`Ver galeria de fotos do imóvel ${
														item.name || item.address
													}`}
												>
													<FiCamera className="icons" aria-hidden="true" />
												</Link>
											</li>
										</ul>
									</div>
								)}

								<div className="card-body content p-4">
									<Link
										href={`/imovel/${item.slug}`}
										className="title fs-5 text-dark fw-medium"
									>
										{item.name}
									</Link>

									<ul className="list-unstyled mt-3 mb-0 pt-3 border-top row">
										<li className="col-6 d-flex align-items-center m-0">
											<span
											>
												<Mdi n="arrow-expand-all" className="fs-5 me-2 text-primary" />
												<small className="text-muted">
													{item.preview.area}
												</small>
											</span>
										</li>

										<li className="col-6 d-flex align-items-center m-0">
											<span
											>
												<Mdi n="bed" className="fs-5 me-2 text-primary" />
												<small className="text-muted">
													{item.preview.bedroom}
												</small>
											</span>
										</li>
									</ul>
									<ul className="list-unstyled pb-3 pt-0 border-bottom row">
										<li className="col-6 d-flex align-items-center m-0">
											<span
											>
												<Mdi n="shower" className="fs-5 me-2 text-primary" />
												<small className="text-muted">
													{item.preview.suite}
												</small>
											</span>
										</li>

										<li className="col-6 d-flex align-items-center m-0">
											<span
											>
												<Mdi n="car" className="fs-5 me-2 text-primary" />
												<small className="text-muted">
													{item.preview.parking}
												</small>
											</span>
										</li>
									</ul>

									<ul className="list-unstyled d-flex justify-content-between mt-2 mb-0">
										<li className="list-inline-item mb-0">
											<span className="text-muted">Preço</span>
											<p
												className="fw-medium mb-0"
											>
												{item.price === 0 ? (
													"Consulte"
												) : (
													<>
														{formatPrice(item.price)}
													</>
												)}
											</p>
										</li>
									</ul>
								</div>
							</div>
						</div>
					);
				})}

				<div className="col-12 mt-4 pt-2">
					<div className="text-center">
						<Link href="/imoveis" className="mt-3 fs-6 text-primary">
							Veja mais opções{" "}
							<Mdi n="arrow-right" className="align-middle" />
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
