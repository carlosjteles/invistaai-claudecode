"use client";
import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import { getBaseUrl, getSiteName } from "./helper/utils";

const TinySlider = dynamic(() => import("tiny-slider-react"), { ssr: false });
import "../../../node_modules/tiny-slider/dist/tiny-slider.css";

const data = [
	{
		image: "/images/client/01.webp",
		name: "Fernanda Souza",
		title: "Arquiteta",
		desc: '"Encontrei o imóvel ideal para minha família com rapidez. O atendimento foi transparente e o processo bem conduzido do começo ao fim."',
	},
	{
		image: "/images/client/02.webp",
		name: "Marcelo Andrade",
		title: "Engenheiro Civil",
		desc: '"A plataforma é prática e o corretor me passou total segurança durante a negociação. Me senti muito bem orientado."',
	},
	{
		image: "/images/client/03.webp",
		name: "Juliana Castro",
		title: "Advogada",
		desc: '"Tive uma experiência excelente. O corretor foi claro, atencioso e me ajudou a tirar todas as dúvidas antes da compra."',
	},
	{
		image: "/images/client/04.webp",
		name: "Carlos Menezes",
		title: "Empresário",
		desc: '"O imóvel estava exatamente como descrito. A transparência e o profissionalismo fizeram toda a diferença na hora da decisão."',
	},
	{
		image: "/images/client/05.webp",
		name: "Patrícia Lima",
		title: "Designer Gráfica",
		desc: '"Fui muito bem atendida desde o primeiro contato. O corretor demonstrou conhecimento e facilitou cada etapa da compra."',
	},
	{
		image: "/images/client/06.webp",
		name: "Renato Teixeira",
		title: "Professor Universitário",
		desc: '"Foi tudo muito ágil e confiável. Encontrei o imóvel que buscava com o suporte certo, sem burocracia e sem estresse."',
	},
];

const settings = {
	container: ".tiny-three-item",
	controls: false,
	mouseDrag: true,
	loop: true,
	rewind: true,
	autoplay: true,
	autoplayButtonOutput: false,
	autoplayTimeout: 3000,
	navPosition: "bottom",
	speed: 400,
	gutter: 12,
	responsive: {
		992: {
			items: 3,
		},

		767: {
			items: 2,
		},

		320: {
			items: 1,
		},
	},
};

export default function Customers() {
	return (
		<>
			<div className="row justify-content-center">
				<div className="col">
					<div className="section-title text-center mb-4 pb-2">
						<h4 className="title mb-3">O que nossos clientes dizem</h4>
						<p className="text-muted para-desc mb-0 mx-auto">
							Experiências reais de quem comprou com segurança, praticidade e
							total transparência.
						</p>
					</div>
				</div>
			</div>

			<div className="row" itemScope itemType="https://schema.org/ItemList">
				<meta itemProp="name" content="Depoimentos de Clientes" />
				<meta itemProp="itemListOrder" content="Unordered" />
				<meta itemProp="numberOfItems" content={data.length} />

				<div className="col-12 mt-4">
					<div className="tiny-three-item">
						<TinySlider settings={settings}>
							{data.map((item, index) => {
								return (
									<div
										className="tiny-slider client-testi"
										key={index}
										itemScope
										itemType="https://schema.org/Review"
										itemProp="itemListElement"
									>
										<meta itemProp="position" content={index + 1} />

										<div className="card border-0 bg-white">
											<div className="card-body p-4 rounded-3 shadow m-2">
												<i className="mdi mdi-format-quote-open display-1 text-primary opacity-25 position-absolute end-0 top-0"></i>

												<div className="d-flex">
													<Image
														src={item.image}
														width={45}
														height={45}
														className="avatar avatar-md-sm rounded-circle shadow-md"
														alt={item.name}
														itemProp="image"
													/>
													<div className="flex-1 ms-3">
														<p
															className="fw-semibold mb-0"
															itemProp="author"
															itemScope
															itemType="https://schema.org/Person"
														>
															<span itemProp="name">{item.name}</span>
															<meta itemProp="jobTitle" content={item.title} />
														</p>
														<small className="text-muted">{item.title}</small>
													</div>
												</div>

												<p
													className="text-muted fst-italic mb-0 mt-4"
													itemProp="reviewBody"
												>
													{item.desc}
												</p>

												<div
													itemProp="reviewRating"
													itemScope
													itemType="https://schema.org/Rating"
												>
													<meta itemProp="worstRating" content="1" />
													<meta itemProp="bestRating" content="5" />
													<meta itemProp="ratingValue" content="5" />

													<ul className="list-unstyled mb-0 mt-3 text-warning h5">
														<li className="list-inline-item">
															<i className="mdi mdi-star"></i>
														</li>
														<li className="list-inline-item">
															<i className="mdi mdi-star"></i>
														</li>
														<li className="list-inline-item">
															<i className="mdi mdi-star"></i>
														</li>
														<li className="list-inline-item">
															<i className="mdi mdi-star"></i>
														</li>
														<li className="list-inline-item">
															<i className="mdi mdi-star"></i>
														</li>
													</ul>
												</div>

												<div
													itemProp="itemReviewed"
													itemScope
													itemType="https://schema.org/RealEstateAgent"
													itemID={`${getBaseUrl()}#organization`}
												>
													<meta itemProp="name" content={getSiteName()} />
													<meta itemProp="url" content={getBaseUrl()} />
												</div>

												<meta itemProp="datePublished" content="2023-01-01" />
											</div>
										</div>
									</div>
								);
							})}
						</TinySlider>
					</div>
				</div>
			</div>
		</>
	);
}
