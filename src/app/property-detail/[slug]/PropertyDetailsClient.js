"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import dynamic from "next/dynamic";

import PropertyDetailImg from "../../components/PropertyDetailImg";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollTop from "../../components/ScrollTop";

const BuildingDocumentsSlider = dynamic(
	() => import("../../components/BuildingDocumentsSlider"),
	{ ssr: false }
);

const FinancingSimulation = dynamic(
	() => import("../../components/FinancingSimulation"),
	{ ssr: false }
);

const RelatedPropertySlider = dynamic(
	() => import("../../components/RelatedPropertySlider"),
	{ ssr: false }
);

const YoutubeEmbed = dynamic(() => import("../../components/YoutubeEmbed"), {
	ssr: false,
});

import { categories } from "../../storage/filters";
import { contact } from "../../storage/about";

import { formatPrice } from "../../helper/formatter";
import { getBaseUrl, getSiteName, getVideoId } from "../../helper/utils";

export default function PropertyDetailsClient({
	propertyData,
	relatedProperties,
}) {
	const searchParams = useSearchParams();
	const openGallery = searchParams.get("openGallery");

	const [activeTab, setActiveTab] = React.useState("plantas");

	const hasValidYoutubeVideo = React.useMemo(() => {
		if (!propertyData.video) return false;
		const videoId = getVideoId(propertyData.video);
		return videoId !== null && videoId !== undefined;
	}, [propertyData.video]);

	const buildingDocumentsImages = React.useMemo(() => {
		if (!propertyData.images) return [];
		return propertyData.images.filter(
			(img) => img.type === "building_documents"
		);
	}, [propertyData.images]);

	const perspectiveImages = React.useMemo(() => {
		if (!propertyData.images) return [];
		return propertyData.images.filter((img) => img.type === "perspectives");
	}, [propertyData.images]);

	const typelogiesByType = React.useMemo(() => {
		if (!propertyData.typelogies) return {};
		return propertyData.typelogies.reduce((type, item) => {
			if (!type[item.type]) {
				type[item.type] = [];
			}

			type[item.type].push(item);

			return type;
		}, {});
	}, [propertyData.typelogies]);

	const whatsappMessage = (propertyName) => {
		const text = `Olá, quero agendar uma visita para o imóvel ${propertyName} que vi no site.`;
		return `https://wa.me/${contact.phone}?text=${encodeURIComponent(text)}`;
	};

	const brandName = React.useMemo(() => {
		const kw = propertyData.seo?.keywords;
		if (Array.isArray(kw)) {
			if (kw.length >= 2) return kw[kw.length - 2];
			if (kw.length === 1) return kw[0];
			return getSiteName();
		}
		if (typeof kw === "string" && kw.trim().length > 0) return kw;
		return getSiteName();
	}, [propertyData.seo]);

	const propertySchema = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: propertyData.name || propertyData.address,
		description: propertyData.description
			? Array.isArray(propertyData.description)
				? propertyData.description.join(" ")
				: propertyData.description
			: "",
		image: propertyData.images?.map((img) => img.src) || [],
		identifier: propertyData.id,
		url: `${getBaseUrl()}/imovel/${propertyData.slug}`,
		category:
			categories.find((item) => item.id === propertyData.category)?.label ||
			"Imóvel",
		brand: {
			"@type": "Organization",
			name: brandName,
		},
		...(propertyData.price > 0 && {
			offers: [
				{
					"@type": "Offer",
					price: Number(propertyData.price).toFixed(2),
					priceCurrency: "BRL",
					availability: "https://schema.org/InStock",
					url: `${getBaseUrl()}/imovel/${propertyData.slug}`,
					seller: {
						"@type": "Organization",
						name: getSiteName(),
					},
					itemOffered: {
						"@type": "Place",
						address: {
							"@type": "PostalAddress",
							addressLocality: propertyData.seo?.city,
							addressRegion: propertyData.seo?.state,
							postalCode: propertyData.seo?.zip,
							streetAddress: propertyData.seo?.street,
							addressCountry: "BR",
						},
					},
				},
			],
		}),
		additionalProperty: [
			{
				"@type": "PropertyValue",
				name: "Quartos",
				value: Array.isArray(propertyData.bedroom)
					? Math.min(
							...propertyData.bedroom.filter((v) => typeof v === "number")
					  )
					: propertyData.bedroom || 0,
			},
			{
				"@type": "PropertyValue",
				name: "Suítes",
				value: Array.isArray(propertyData.suite)
					? Math.min(...propertyData.suite.filter((v) => typeof v === "number"))
					: propertyData.suite || 0,
			},
			{
				"@type": "PropertyValue",
				name: "Vagas de Garagem",
				value: propertyData.preview?.parking || 0,
			},
			{
				"@type": "PropertyValue",
				name: "Área Total",
				value: propertyData.preview?.area || propertyData.min_area || "0 m²",
			},
			...(propertyData.delivery_in
				? [
						{
							"@type": "PropertyValue",
							name: "Previsão de Entrega",
							value: propertyData.delivery_in,
						},
				  ]
				: []),
			...(propertyData.release_in
				? [
						{
							"@type": "PropertyValue",
							name: "Data de Lançamento",
							value: propertyData.release_in,
						},
				  ]
				: []),
		].filter(Boolean),
		...(propertyData.quantity_reviews > 0 && {
			aggregateRating: {
				"@type": "AggregateRating",
				ratingValue: Number(propertyData.rating) || 0,
				reviewCount: propertyData.quantity_reviews || 0,
				bestRating: 5,
				worstRating: 1,
			},
		}),
	};

	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: getBaseUrl(),
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Imóveis",
				item: `${getBaseUrl()}/imoveis`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: propertyData.name || propertyData.address,
				item: `${getBaseUrl()}/imovel/${propertyData.slug}`,
			},
		],
	};

	return (
		<>
			<Script
				id="property-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
			/>

			<Script
				id="breadcrumb-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
			/>

			<Navbar
				navClass="defaultscroll sticky"
				menuClass="navigation-menu nav-center"
			/>
			<section className="section mt-5 pt-4">
				<div className="container-fluid mt-2">
					<PropertyDetailImg
						images={perspectiveImages}
						title={propertyData.name || propertyData.address}
						openGallery={openGallery}
					/>
				</div>

				<div className="container text-center">
					<nav aria-label="Navegação estrutural">
						<ol className="breadcrumb">
							<li className="breadcrumb-item">
								<Link href="/" aria-label="Página de início">
									Home
								</Link>
							</li>
							<li className="breadcrumb-item">
								<Link href="/imoveis" aria-label="Página de imóveis">
									Imóveis
								</Link>
							</li>
						</ol>
					</nav>
				</div>

				<div className="container mt-80 mt-60">
					<div className="row g-4">
						<div className="col-lg-8 col-md-7 col-12">
							<div className="section-title">
								<h1 className="title mb-0">
									{propertyData.name || propertyData.address}
								</h1>
								<ul className="list-unstyled row align-items-center justify-content-between mb-0 py-3">
									<li className="col-6 col-md-auto ms-0">
										<span className="d-flex align-items-center">
											<i
												className="mdi mdi-arrow-expand-all fs-4 me-2 text-primary"
												aria-hidden="true"
											></i>
											<span className="text-muted fs-5">
												<small>{propertyData.preview?.area}</small> m²
											</span>
										</span>
									</li>

									<li className="col-6 col-md-auto ms-0">
										<span className="d-flex align-items-center">
											<i
												className="mdi mdi-bed fs-4 me-2 text-primary"
												aria-hidden="true"
											></i>
											<span className="text-muted fs-5">
												<small>{propertyData.preview?.bedroom}</small>
											</span>
										</span>
									</li>

									<li className="col-6 col-md-auto ms-0">
										<span className="d-flex align-items-center">
											<i
												className="mdi mdi-shower fs-4 me-2 text-primary"
												aria-hidden="true"
											></i>
											<span className="text-muted fs-5">
												<small>{propertyData.preview?.suite}</small>
											</span>
										</span>
									</li>

									<li className="col-6 col-md-auto ms-0">
										<span className="d-flex align-items-center">
											<i
												className="mdi mdi-car fs-4 me-2 text-primary"
												aria-hidden="true"
											></i>
											<span className="text-muted fs-5">
												<small>{propertyData.preview?.parking}</small>
											</span>
										</span>
									</li>
								</ul>

								{Array.isArray(propertyData.description) &&
								typeof propertyData.description[0] === "object" ? (
									propertyData.description.map((dataDescription, index) => (
										<div key={index} className="mb-4">
											{dataDescription.title && (
												<h2 className="h5 mb-3 text-dark">
													{dataDescription.title}
												</h2>
											)}
											{dataDescription.content &&
												Array.isArray(dataDescription.content) &&
												typeof dataDescription.content === "string" && (
													<p className="text-muted">
														{dataDescription.content}
													</p>
												)}
										</div>
									))
								) : (
									<>
										{propertyData.description &&
											(Array.isArray(propertyData.description) &&
											typeof propertyData.description[0] === "string" ? (
												propertyData.description.map((desc, index) => (
													<p key={index} className="text-muted">
														{desc}
													</p>
												))
											) : (
												<p className="text-muted">{propertyData.description}</p>
											))}

										{propertyData.attributes &&
											propertyData.attributes.length > 0 && (
												<>
													<h2 className="h5 mb-3 text-dark">Características</h2>
													<ul className="row list-unstyled">
														{propertyData.attributes.map((attr, index) => (
															<li
																key={index}
																className="col-6 mb-2 mx-0 align-items-center"
															>
																<span className="text-muted">{attr}</span>
															</li>
														))}
													</ul>
												</>
											)}
									</>
								)}

								{typelogiesByType &&
									Object.keys(typelogiesByType).length > 0 && (
										<div className="mb-4">
											<h2 className="h5 mb-3 text-dark">
												Tipologias Disponíveis
											</h2>
											{Object.entries(typelogiesByType).map(([type, items]) => (
												<table
													className="table table-hover caption-top mb-4"
													key={type}
												>
													<caption
														className="text-dark fs-6 ms-2"
														style={{
															borderBottom: "1px solid rgb(223 223 223 / 75%)",
														}}
													>
														{type}
													</caption>
													<thead>
														<tr>
															<th scope="col" className="text-muted">
																A partir de
															</th>
															<th scope="col" className="text-muted">
																m²
															</th>
															<th scope="col" aria-label="Quartos">
																<i
																	className="mdi mdi-bed fs-5 me-2 text-muted"
																	aria-hidden="true"
																></i>
															</th>
															<th scope="col" aria-label="Banheiros">
																<i
																	className="mdi mdi-shower fs-5 me-2 text-muted"
																	aria-hidden="true"
																></i>
															</th>
															<th scope="col" aria-label="Vagas de Garagem">
																<i
																	className="mdi mdi-car fs-5 me-2 text-muted"
																	aria-hidden="true"
																></i>
															</th>
														</tr>
													</thead>
													<tbody>
														{items.map((item, idx) => (
															<tr key={idx}>
																<td className="text-muted">
																	{item.price === 0
																		? "Consulte"
																		: formatPrice(item.price)}
																</td>
																<td className="text-muted">
																	{item.private_area}
																</td>
																<td className="text-muted">{item.bedrooms}</td>
																<td className="text-muted">{item.suites}</td>
																<td className="text-muted">{item.parking}</td>
															</tr>
														))}
													</tbody>
												</table>
											))}
										</div>
									)}

								{(buildingDocumentsImages.length > 0 ||
									hasValidYoutubeVideo) && (
									<div className="mb-4">
										<ul className="nav nav-pills nav-justified mb-0">
											<li className="nav-item">
												<a
													className={`nav-link ${
														activeTab === "plantas" ? "active" : ""
													}`}
													aria-current="page"
													href="#"
													onClick={(e) => {
														e.preventDefault();
														setActiveTab("plantas");
													}}
												>
													Plantas
												</a>
											</li>
											<li className="nav-item">
												<a
													className={`nav-link ${
														activeTab === "video" ? "active" : ""
													}`}
													href="#"
													onClick={(e) => {
														e.preventDefault();
														setActiveTab("video");
													}}
												>
													Video
												</a>
											</li>
										</ul>
										<div className="tab-content ps-4 pe-4 pb-4 pt-2 border border-top-0 rounded-bottom">
											{activeTab === "plantas" && (
												<div
													className="tab-pane fade show active"
													role="tabpanel"
													id="tab-plantas"
												>
													{buildingDocumentsImages.length > 0 ? (
														<BuildingDocumentsSlider
															images={buildingDocumentsImages}
														/>
													) : (
														<div className="text-center py-5">
															<span className="text-muted">Indisponível</span>
														</div>
													)}
												</div>
											)}

											{activeTab === "video" && (
												<div
													className="tab-pane fade show active"
													role="tabpanel"
													id="tab-video"
												>
													{hasValidYoutubeVideo ? (
														<YoutubeEmbed video={propertyData.video} />
													) : (
														<div className="text-center py-5">
															<span className="text-muted">Indisponível</span>
														</div>
													)}
												</div>
											)}
										</div>
									</div>
								)}

								{propertyData.description_embed && (
									<div className="card map border-0 mt-2">
										<div className="card-body p-0">
											<iframe
												src={propertyData.description_embed}
												className="rounded-3"
												style={{ border: "0" }}
												title={`Endereço do imóvel: ${propertyData.address}`}
												loading="lazy"
												allowFullScreen=""
											></iframe>
										</div>
									</div>
								)}
							</div>
						</div>

						<div className="col-lg-4 col-md-5 col-12">
							<div className="rounded-3 shadow bg-white sticky-bar p-4">
								{propertyData.price > 0 && (
									<h2 className="mb-3 h5">A partir de:</h2>
								)}

								<div className="d-flex align-items-center justify-content-between">
									<h3 className="mb-0 h5">
										{propertyData.price === 0
											? "Consulte"
											: formatPrice(propertyData.price)}
									</h3>
									<span className="badge bg-primary">
										{
											categories.find(
												(item) => item.id === propertyData.category
											)?.label
										}
									</span>
								</div>

								<div>
									{propertyData.price > 0 && propertyData.min_area && (
										<div className="d-flex align-items-center justify-content-between mt-2">
											<span className="small text-muted">Preço por m²</span>
											<span className="small">
												{formatPrice(
													propertyData.price / propertyData.min_area
												)}
											</span>
										</div>
									)}

									{propertyData.delivery_in && (
										<div className="d-flex align-items-center justify-content-between mt-2">
											<span className="small text-muted">Entrega</span>
											<span className="small">{propertyData.delivery_in}</span>
										</div>
									)}
									{propertyData.release_in && (
										<div className="d-flex align-items-center justify-content-between mt-2">
											<span className="small text-muted">Lançamento</span>
											<span className="small">{propertyData.release_in}</span>
										</div>
									)}
								</div>

								<div className="d-flex mt-3 gap-2">
									{propertyData.book && (
										<Link
											href={propertyData.book}
											className="btn btn-primary w-100 small"
											aria-label={`Baixar book do imóvel ${propertyData.name}`}
										>
											Download Book
										</Link>
									)}

									<Link
										href={whatsappMessage(propertyData.name)}
										target="_blank"
										rel="noopener noreferrer"
										className="btn btn-primary w-100 small"
										aria-label={`Agendar visita por WhatsApp para ${propertyData.name}`}
									>
										{propertyData.price > 0 ? "Agendar Agora" : "Consultar"}
									</Link>
								</div>

								{propertyData.price > 0 && propertyData.price < 600000 && (
									<FinancingSimulation />
								)}
							</div>
						</div>
					</div>
				</div>

				{relatedProperties && relatedProperties.length > 0 && (
					<div className="container mt-100 mt-60">
						<div className="row justify-content-center">
							<div className="col">
								<div className="section-title text-center mb-4 pb-2">
									<h2 className="title mb-3">Você também pode gostar</h2>
									<p className="text-muted para-desc mb-0 mx-auto">
										Confira opções semelhantes à venda e encontre seu próximo
										imóvel.
									</p>
								</div>
							</div>
						</div>

						<RelatedPropertySlider propertyData={relatedProperties} />
					</div>
				)}
			</section>
			<Footer />
			<ScrollTop />
		</>
	);
}
