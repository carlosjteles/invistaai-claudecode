"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

import { propertyData } from "../storage/data";

import { FiHome, FiCamera } from "../assets/icons/vander";

const TinySlider = dynamic(() => import("tiny-slider-react"), { ssr: false });
import "../../../node_modules/tiny-slider/dist/tiny-slider.css";

import { formatPrice } from "../helper/formatter";

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

export default function ProprtySlider() {
	return (
		<div className="row">
			<div className="col-12">
				<div className="tiny-slide-three">
					<TinySlider settings={settings}>
						{propertyData.map((item, index) => {
							return (
								<div className="tiny-slide" key={index}>
									<div className="card property border-0 shadow position-relative overflow-hidden rounded-3 m-2">
										<div className="property-image position-relative overflow-hidden shadow">
											<Image
												src={item.image}
												width={0}
												height={0}
												sizes="100vw"
												style={{ width: "100%", height: "auto" }}
												className="img-fluid"
												alt={item.address}
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
										<div className="card-body content p-4">
											<Link
												href={`/imovel/${item.slug}`}
												className="title fs-5 text-dark fw-medium"
											>
												{item.address}
											</Link>

											<ul className="list-unstyled mt-3 mb-0 pt-3 border-top row">
												<li className="col-6 d-flex align-items-center m-0">
													<i className="mdi mdi-arrow-expand-all fs-5 me-2 text-primary"></i>
													<small className="text-muted">
														{item.preview.area}
													</small>
												</li>

												<li className="col-6 d-flex align-items-center m-0">
													<i className="mdi mdi-bed fs-5 me-2 text-primary"></i>
													<small className="text-muted">
														{item.preview.bedroom}
													</small>
												</li>
											</ul>
											<ul className="list-unstyled pb-3 pt-0 border-bottom row">
												<li className="col-6 d-flex align-items-center m-0">
													<i className="mdi mdi-shower fs-5 me-2 text-primary"></i>
													<small className="text-muted">
														{item.preview.suite}
													</small>
												</li>

												<li className="col-6 d-flex align-items-center m-0">
													<i className="mdi mdi-car fs-5 me-2 text-primary"></i>
													<small className="text-muted">
														{item.preview.parking}
													</small>
												</li>
											</ul>

											<ul className="list-unstyled d-flex justify-content-between mt-2 mb-0">
												<li className="list-inline-item mb-0">
													<span className="text-muted">Preço</span>
													<p className="fw-medium mb-0">
														{formatPrice(item.price)}
													</p>
												</li>
												<li className="list-inline-item mb-0 text-muted">
													<span className="text-muted">Avaliação</span>
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
