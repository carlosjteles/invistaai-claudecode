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
		return videoId !== null;
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

	const propertySchema = {
		"@context": "https://schema.org",
		"@type": "RealEstateListing",
		name: propertyData.name || propertyData.address,
		description: propertyData.description
			? Array.isArray(propertyData.description)
				? propertyData.description.join(" ")
				: propertyData.description
			: "",
		image: propertyData.images?.map((img) => img.src) || [],
		url: `${getBaseUrl()}/imovel/${propertyData.slug}`,
		address: {
			"@type": "PostalAddress",
			addressLocality: propertyData.seo?.city,
			addressRegion: propertyData.seo?.state,
			postalCode: propertyData.seo?.zip,
			streetAddress: propertyData.seo?.street,
			addressCountry: "BR",
		},
		offers:
			propertyData.price > 0
				? {
						"@type": "Offer",
						price: propertyData.price,
						priceCurrency: "BRL",
						availability: "https://schema.org/InStock",
				  }
				: undefined,
		numberOfRooms: Array.isArray(propertyData.bedroom)
			? Math.min(...propertyData.bedroom.filter((v) => typeof v === "number"))
			: propertyData.bedroom,
		numberOfBathroomsTotal: Array.isArray(propertyData.suite)
			? Math.min(...propertyData.suite)
			: propertyData.suite,
		floorSize: {
			"@type": "QuantitativeValue",
			value: propertyData.min_area,
			unitCode: "MTK",
			unitText: "m²",
		},
		amenityFeature: [
			{
				"@type": "LocationFeatureSpecification",
				name: "Quartos",
				value: Array.isArray(propertyData.bedroom)
					? Math.min(
							...propertyData.bedroom.filter((v) => typeof v === "number")
					  )
					: propertyData.bedroom,
			},
			{
				"@type": "LocationFeatureSpecification",
				name: "Suítes",
				value: Array.isArray(propertyData.suite)
					? Math.min(...propertyData.suite)
					: propertyData.suite,
			},
			{
				"@type": "LocationFeatureSpecification",
				name: "Vagas de Garagem",
				value: propertyData.preview?.parking,
			},
		],
		broker: {
			"@type": "RealEstateAgent",
			name: getSiteName(),
			telephone: `+${contact.phone}`,
			email: contact.email,
		},
		breadcrumb: {
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
		},
	};

	return (
		<>
			<Script
				id="property-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
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
					<nav aria-label="breadcrumb">
						<ol
							className="breadcrumb"
							itemScope
							itemType="https://schema.org/BreadcrumbList"
						>
							<li
								className="breadcrumb-item"
								itemProp="itemListElement"
								itemScope
								itemType="https://schema.org/ListItem"
							>
								<Link href="/" itemProp="item">
									<span itemProp="name">Home</span>
								</Link>
								<meta itemProp="position" content="1" />
							</li>
							<li
								className="breadcrumb-item"
								itemProp="itemListElement"
								itemScope
								itemType="https://schema.org/ListItem"
							>
								<Link href="/imoveis" itemProp="item">
									<span itemProp="name">Imóveis</span>
								</Link>
								<meta itemProp="position" content="2" />
							</li>
							<li
								className="breadcrumb-item active"
								aria-current="page"
								itemProp="itemListElement"
								itemScope
								itemType="https://schema.org/ListItem"
							>
								<span itemProp="name">
									{propertyData.name || propertyData.address}
								</span>
								<meta itemProp="position" content="3" />
								<meta
									itemProp="item"
									content={`${getBaseUrl()}/imovel/${propertyData.slug}`}
								/>
							</li>
						</ol>
					</nav>
				</div>

				<div className="container mt-80 mt-60">
					<div className="row g-4">
						<div className="col-lg-8 col-md-7 col-12">
							<div
								className="section-title"
								itemScope
								itemType="https://schema.org/Product"
							>
								<meta
									itemProp="name"
									content={propertyData.name || propertyData.address}
								/>
								<meta
									itemProp="description"
									content={
										propertyData.description
											? Array.isArray(propertyData.description)
												? propertyData.description.join(" ")
												: propertyData.description
											: ""
									}
								/>
								<meta
									itemProp="image"
									content={
										propertyData.images.length > 0
											? propertyData.images[0].src
											: ""
									}
								/>
								<h4 className="title mb-0">
									{propertyData.name || propertyData.address}
								</h4>
								<ul className="list-unstyled row align-items-center justify-content-between mb-0 py-3">
									<li className="col-6 col-md-auto ms-0">
										<span className="d-flex align-items-center">
											<i className="mdi mdi-arrow-expand-all fs-4 me-2 text-primary"></i>
											<span
												className="text-muted fs-5"
												itemProp="additionalProperty"
												itemScope
												itemType="https://schema.org/PropertyValue"
											>
												<meta itemProp="name" content="Área" />
												<small itemProp="value">
													{propertyData.preview?.area}
												</small>
											</span>
										</span>
									</li>

									<li className="col-6 col-md-auto ms-0">
										<span className="d-flex align-items-center">
											<i className="mdi mdi-bed fs-4 me-2 text-primary"></i>
											<span
												className="text-muted fs-5"
												itemProp="additionalProperty"
												itemScope
												itemType="https://schema.org/PropertyValue"
											>
												<meta itemProp="name" content="Quartos" />
												<small itemProp="value">
													{propertyData.preview?.bedroom}
												</small>
											</span>
										</span>
									</li>

									<li className="col-6 col-md-auto ms-0">
										<span className="d-flex align-items-center">
											<i className="mdi mdi-shower fs-4 me-2 text-primary"></i>
											<span
												className="text-muted fs-5"
												itemProp="additionalProperty"
												itemScope
												itemType="https://schema.org/PropertyValue"
											>
												<meta itemProp="name" content="Suítes" />
												<small itemProp="value">
													{propertyData.preview?.suite}
												</small>
											</span>
										</span>
									</li>

									<li className="col-6 col-md-auto ms-0">
										<span className="d-flex align-items-center">
											<i className="mdi mdi-car fs-4 me-2 text-primary"></i>
											<span
												className="text-muted fs-5"
												itemProp="additionalProperty"
												itemScope
												itemType="https://schema.org/PropertyValue"
											>
												<meta itemProp="name" content="Vagas" />
												<small itemProp="value">
													{propertyData.preview?.parking}
												</small>
											</span>
										</span>
									</li>
								</ul>

								{propertyData.description &&
									(Array.isArray(propertyData.description) ? (
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
											<h5 className="mb-3 text-dark">Características</h5>
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

								{typelogiesByType &&
									Object.keys(typelogiesByType).length > 0 && (
										<div className="mb-4">
											<h5 className="mb-3 text-dark">Tipologias Disponíveis</h5>
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
																m2
															</th>
															<th scope="col">
																<i className="mdi mdi-bed fs-5 me-2 text-muted"></i>
															</th>
															<th scope="col">
																<i className="mdi mdi-shower fs-5 me-2 text-muted"></i>
															</th>
															<th scope="col">
																<i className="mdi mdi-car fs-5 me-2 text-muted"></i>
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
												<div className="tab-pane fade show active">
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
												<div className="tab-pane fade show active">
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
												title={propertyData.address}
												allowFullScreen
											></iframe>
										</div>
									</div>
								)}
							</div>
						</div>

						<div className="col-lg-4 col-md-5 col-12">
							<div className="rounded-3 shadow bg-white sticky-bar p-4">
								{propertyData.price > 0 && (
									<h5 className="mb-3">A partir de:</h5>
								)}

								<div className="d-flex align-items-center justify-content-between">
									<h5
										className="mb-0"
										itemProp="offers"
										itemScope
										itemType="https://schema.org/Offer"
									>
										{propertyData.price === 0 ? (
											"Consulte"
										) : (
											<>
												<meta itemProp="priceCurrency" content="BRL" />
												<meta itemProp="price" content={propertyData.price} />
												<meta
													itemProp="availability"
													content="https://schema.org/InStock"
												/>
												{formatPrice(propertyData.price)}
											</>
										)}
									</h5>
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

								<div className="d-flex mt-3">
									{propertyData.book && (
										<Link
											href={propertyData.book}
											className="btn btn-primary w-100 small me-2"
										>
											Download Book
										</Link>
									)}

									<Link
										href={whatsappMessage(propertyData.name)}
										className="btn btn-primary w-100 small"
										aria-label="Agendar visita por WhatsApp"
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
					<div
						className="container mt-100 mt-60"
						itemScope
						itemType="https://schema.org/ItemList"
					>
						<meta itemProp="name" content="Imóveis Relacionados" />
						<meta itemProp="numberOfItems" content={relatedProperties.length} />

						<div className="row justify-content-center">
							<div className="col">
								<div className="section-title text-center mb-4 pb-2">
									<h1 className="title mb-3">Você também pode gostar</h1>
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
