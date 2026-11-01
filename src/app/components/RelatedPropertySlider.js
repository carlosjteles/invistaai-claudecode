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
	const [ready, setReady] = React.useState(false);

	React.useEffect(() => {
		setReady(true);
	}, []);

	const slides = propertyData.map((item, index) => {
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
						<meta itemProp="url" content={`${getBaseUrl()}/imovel/${item.slug}`} />
						<meta itemProp="name" content={item.name} />

						<div
							className="card property border-0 shadow position-relative overflow-hidden rounded-3 m-2"
						>

							{thumbnail && (
								<div className="property-image position-relative overflow-hidden shadow">
									<Image
										src={thumbnail.src}
										width={0}
										height={0}
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
										quality={70}
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
									{item.name || item.address}
								</Link>


								<div
								>
									<ul className="list-unstyled mt-3 mb-0 pt-3 border-top row">
										<li className="col-6 d-flex align-items-center m-0">
											<i className="mdi mdi-arrow-expand-all fs-5 me-2 text-primary"></i>
											<small className="text-muted">
												{item.preview?.area}
											</small>
										</li>

										<li className="col-6 d-flex align-items-center m-0">
											<i className="mdi mdi-bed fs-5 me-2 text-primary"></i>
											<small className="text-muted">
												{item.preview?.bedroom}
											</small>
										</li>
									</ul>
									<ul className="list-unstyled pb-3 pt-0 border-bottom row">
										<li className="col-6 d-flex align-items-center m-0">
											<i className="mdi mdi-shower fs-5 me-2 text-primary"></i>
											<small className="text-muted">
												{item.preview?.suite}
											</small>
										</li>

										<li className="col-6 d-flex align-items-center m-0">
											<i className="mdi mdi-car fs-5 me-2 text-primary"></i>
											<small className="text-muted">
												{item.preview?.parking}
											</small>
										</li>
									</ul>
								</div>

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
			});

	return (
		<div className="row" itemScope itemType="https://schema.org/ItemList">
			<meta itemProp="name" content="Imóveis Relacionados" />
			<meta itemProp="numberOfItems" content={propertyData.length} />
			<meta itemProp="itemListOrder" content="Unordered" />

			<div className="col-12">
				<div className="tiny-slide-three">
					{ready ? (
						<TinySlider settings={settings}>{slides}</TinySlider>
					) : (
						<div className="row">
							{slides.map((slide, index) => (
								<div className="col-lg-4 col-md-6 col-12" key={index}>
									{slide}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
