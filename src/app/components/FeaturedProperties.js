import Link from "next/link";
import Image from "next/image";

import { FiHome, FiCamera } from "../assets/icons/vander";

import { formatPrice } from "../helper/formatter";

import prisma from "../../db/prisma";

export default async function FeaturedProperties() {
	const propertyData = await prisma.property.findMany({
		where: {
			images: {
				some: {},
			},
		},
		take: 6,
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
						<h4 className="title mb-3">Imóveis em destaque</h4>
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

					return (
						<div
							className="col-lg-4 col-md-6 col-12"
							key={index}
							itemProp="itemListElement"
							itemScope
							itemType="https://schema.org/ListItem"
						>
							<meta itemProp="position" content={index + 1} />

							<div
								className="card property border-0 shadow position-relative overflow-hidden rounded-3"
								itemScope
								itemType="https://schema.org/RealEstateListing"
							>
								<meta itemProp="identifier" content={item.id} />
								<meta itemProp="url" content={`/imovel/${item.slug}`} />

								{thumbnail && (
									<div className="property-image position-relative overflow-hidden shadow">
										<Image
											src={thumbnail.src}
											width={0}
											height={0}
											sizes="100vw"
											style={{ width: "100%", height: "auto" }}
											className="img-fluid"
											alt={thumbnail.alt}
											itemProp="image"
										/>
										<ul className="list-unstyled property-icon">
											<li>
												<Link
													href={`/imovel/${item.slug}`}
													className="btn btn-sm btn-icon btn-pills btn-primary"
												>
													<FiHome className="icons" />
												</Link>
											</li>
											<li className="mt-1">
												<Link
													href={`/imovel/${item.slug}?openGallery=true`}
													className="btn btn-sm btn-icon btn-pills btn-primary"
												>
													<FiCamera className="icons" />
												</Link>
											</li>
										</ul>
									</div>
								)}

								<div className="card-body content p-4">
									<Link
										href={`/imovel/${item.slug}`}
										className="title fs-5 text-dark fw-medium"
										itemProp="name"
									>
										{item.name}
									</Link>

									<div
										itemProp="accommodationFeature"
										itemScope
										itemType="https://schema.org/QuantitativeValue"
									>
										<ul className="list-unstyled mt-3 mb-0 pt-3 border-top row">
											<li className="col-6 d-flex align-items-center m-0">
												<i className="mdi mdi-arrow-expand-all fs-5 me-2 text-primary"></i>
												<small className="text-muted" itemProp="value">
													{item.preview.area}
												</small>
												<meta itemProp="unitText" content="m²" />
											</li>

											<li className="col-6 d-flex align-items-center m-0">
												<i className="mdi mdi-bed fs-5 me-2 text-primary"></i>
												<small className="text-muted">
													{item.preview.bedroom}
												</small>
												<meta itemProp="unitText" content="bedroom" />
											</li>
										</ul>
										<ul className="list-unstyled pb-3 pt-0 border-bottom row">
											<li className="col-6 d-flex align-items-center m-0">
												<i className="mdi mdi-shower fs-5 me-2 text-primary"></i>
												<small className="text-muted">
													{item.preview.suite}
												</small>
												<meta itemProp="unitText" content="bathroom" />
											</li>

											<li className="col-6 d-flex align-items-center m-0">
												<i className="mdi mdi-car fs-5 me-2 text-primary"></i>
												<small className="text-muted">
													{item.preview.parking}
												</small>
												<meta itemProp="unitText" content="parkingSpace" />
											</li>
										</ul>
									</div>

									<ul className="list-unstyled d-flex justify-content-between mt-2 mb-0">
										<li className="list-inline-item mb-0">
											<span className="text-muted">Preço</span>
											<p
												className="fw-medium mb-0"
												itemProp="offers"
												itemScope
												itemType="https://schema.org/Offer"
											>
												<meta itemProp="priceCurrency" content="BRL" />
												<meta itemProp="price" content={item.price} />
												<span
													itemProp="availability"
													content="https://schema.org/InStock"
												></span>
												{formatPrice(item.price)}
											</p>
										</li>
										<li className="list-inline-item mb-0 text-muted">
											<span className="text-muted">Avaliação</span>
											<div
												itemProp="aggregateRating"
												itemScope
												itemType="https://schema.org/AggregateRating"
											>
												<meta itemProp="ratingValue" content={item.rating} />
												<meta
													itemProp="reviewCount"
													content={item.quantity_reviews}
												/>
												<meta itemProp="bestRating" content="5" />

												<ul className="fw-medium text-warning list-unstyled mb-0">
													<li className="list-inline-item mb-0">
														<i className="mdi mdi-star"></i>
													</li>
													<li className="list-inline-item mb-0">
														<i className="mdi mdi-star"></i>
													</li>
													<li className="list-inline-item mb-0">
														<i className="mdi mdi-star"></i>
													</li>
													<li className="list-inline-item mb-0">
														<i className="mdi mdi-star"></i>
													</li>
													<li className="list-inline-item mb-0">
														<i className="mdi mdi-star"></i>
													</li>
													<li className="list-inline-item mb-0 text-dark">
														{item.rating} ({item.quantity_reviews})
													</li>
												</ul>
											</div>
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
							<i className="mdi mdi-arrow-right align-middle"></i>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
