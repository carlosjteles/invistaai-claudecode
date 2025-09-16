"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

import { FiHome, FiCamera } from "../assets/icons/vander";

const TinySlider = dynamic(() => import("tiny-slider-react"), { ssr: false });
import "../../../node_modules/tiny-slider/dist/tiny-slider.css";

import { formatPrice } from "../helper/formatter";
import { getBaseUrl } from "../helper/utils";

const settings = {
	container: ".tiny-slide-three",
	controls: true,
	mouseDrag: true,
	loop: true,
	rewind: true,
	autoplay: true,
	autoplayButtonOutput: false,
	autoplayTimeout: 3000,
	navPosition: "bottom",
	controlsText: [
		'<i class="mdi mdi-chevron-left "></i>',
		'<i class="mdi mdi-chevron-right"></i>',
	],
	nav: false,
	speed: 400,
	gutter: 0,
	responsive: {
		1025: {
			items: 3,
		},

		992: {
			items: 2,
		},

		767: {
			items: 2,
		},

		320: {
			items: 1,
		},
	},
};

export default function RelatedPropertySlider({ propertyData }) {
	return (
		<div className="row">
			<meta itemProp="name" content="Imóveis Relacionados" />
			<meta itemProp="numberOfItems" content={propertyData.length} />
			<meta itemProp="itemListOrder" content="Unordered" />

			<div className="col-12">
				<div className="tiny-slide-three">
					<TinySlider settings={settings}>
						{propertyData.map((item, index) => {
							const thumbnail = item.images?.[0] || null;

							return (
								<div
									className="tiny-slide"
									key={index}
									itemProp="itemListElement"
									itemScope
									itemType="https://schema.org/ListItem"
								>
									<meta itemProp="position" content={index + 1} />

									<div
										className="card property border-0 shadow position-relative overflow-hidden rounded-3 m-2"
										itemScope
										itemType="https://schema.org/RealEstateListing"
									>
										<meta itemProp="identifier" content={item.id} />
										<meta
											itemProp="url"
											content={`${getBaseUrl()}/imovel/${item.slug}`}
										/>

										{thumbnail && (
											<div className="property-image position-relative overflow-hidden shadow">
												<Image
													src={thumbnail.src}
													width={0}
													height={0}
													sizes="100vw"
													className="img-fluid"
													alt={thumbnail.alt}
													itemProp="image"
												/>
												<ul className="list-unstyled property-icon">
													<li>
														<Link
															href={`/imovel/${item.slug}`}
															className="btn btn-sm btn-icon btn-pills btn-primary"
															aria-label="Ver detalhes do imóvel"
														>
															<FiHome className="icons" />
														</Link>
													</li>
													<li className="mt-1">
														<Link
															href={`/imovel/${item.slug}?openGallery=true`}
															className="btn btn-sm btn-icon btn-pills btn-primary"
															aria-label="Ver galeria de fotos"
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
												{item.name || item.address}
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
															{item.preview?.area}
														</small>
														<meta itemProp="unitText" content="m²" />
													</li>

													<li className="col-6 d-flex align-items-center m-0">
														<i className="mdi mdi-bed fs-5 me-2 text-primary"></i>
														<small className="text-muted">
															{item.preview?.bedroom}
														</small>
														<meta itemProp="unitText" content="bedroom" />
													</li>
												</ul>
												<ul className="list-unstyled pb-3 pt-0 border-bottom row">
													<li className="col-6 d-flex align-items-center m-0">
														<i className="mdi mdi-shower fs-5 me-2 text-primary"></i>
														<small className="text-muted">
															{item.preview?.suite}
														</small>
														<meta itemProp="unitText" content="bathroom" />
													</li>

													<li className="col-6 d-flex align-items-center m-0">
														<i className="mdi mdi-car fs-5 me-2 text-primary"></i>
														<small className="text-muted">
															{item.preview?.parking}
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
														<meta
															itemProp="ratingValue"
															content={item.rating}
														/>
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
					</TinySlider>
				</div>
			</div>
		</div>
	);
}
