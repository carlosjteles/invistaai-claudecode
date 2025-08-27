"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

import PropertyDetailImg from "../../components/PropertyDetailImg";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollTop from "../../components/ScrollTop";
import RelatedPropertySlider from "../../components/RelatedPropertySlider";
import FinancingSimulation from "../../components/FinancingSimulation";

import { categories } from "../../storage/filters";
import { contact } from "../../storage/about";

import { formatPrice } from "../../helper/Formatter";
import { getBaseUrl, getSiteName } from "../../helper/Utils";

export default function PropertyDetailsClient({
	propertyData,
	relatedProperties,
}) {
	const searchParams = useSearchParams();
	const openGallery = searchParams.get("openGallery");

	const whatsappMessage = (property) => {
		const text = `Olá, quero agendar uma visita para o imóvel ${property} que vi no site.`;
		return `https://wa.me/${contact.phone}?text=${encodeURIComponent(text)}`;
	};

	const propertySchema = {
		"@context": "https://schema.org",
		"@type": "RealEstateListing",
		name: propertyData.address,
		description: propertyData.description
			? Array.isArray(propertyData.description)
				? propertyData.description.join(" ")
				: propertyData.description
			: "",
		image: propertyData.images?.map((img) => `${getBaseUrl()}${img.src}`) || [],
		url: `${getBaseUrl()}/imovel/${propertyData.slug}`,
		address: {
			"@type": "PostalAddress",
			addressLocality: propertyData.seo?.city,
			addressRegion: propertyData.seo?.state,
			postalCode: propertyData.seo?.zip,
			streetAddress: propertyData.seo?.street,
			addressCountry: "BR",
		},
		offers: {
			"@type": "Offer",
			price: propertyData.price,
			priceCurrency: "BRL",
			availability: "https://schema.org/InStock",
		},
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
					name: propertyData.address,
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
				menuClass="navigation-menu nav-left"
			/>
			<section className="section mt-5 pt-4">
				<div className="container-fluid mt-2">
					<PropertyDetailImg
						images={propertyData.images}
						address={propertyData.address}
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
								<span itemProp="name">{propertyData.address}</span>
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
								<meta itemProp="name" content={propertyData.address} />
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
										propertyData.images?.[0]
											? `${getBaseUrl()}${propertyData.images[0].src}`
											: ""
									}
								/>

								<h4 className="title mb-0">{propertyData.address}</h4>

								<ul className="list-unstyled d-flex flex-wrap gap-3 align-items-center justify-content-between mb-0 py-3">
									<li className="list-inline-item">
										<span className="d-flex align-items-center">
											<i className="mdi mdi-arrow-expand-all fs-4 me-2 text-primary"></i>
											<span
												className="text-muted fs-5"
												itemProp="additionalProperty"
												itemScope
												itemType="https://schema.org/PropertyValue"
											>
												<meta itemProp="name" content="Área" />
												<span itemProp="value">
													{propertyData.preview?.area}
												</span>
											</span>
										</span>
									</li>

									<li className="list-inline-item">
										<span className="d-flex align-items-center">
											<i className="mdi mdi-bed fs-4 me-2 text-primary"></i>
											<span
												className="text-muted fs-5"
												itemProp="additionalProperty"
												itemScope
												itemType="https://schema.org/PropertyValue"
											>
												<meta itemProp="name" content="Quartos" />
												<span itemProp="value">
													{propertyData.preview?.bedroom}
												</span>
											</span>
										</span>
									</li>

									<li className="list-inline-item">
										<span className="d-flex align-items-center">
											<i className="mdi mdi-shower fs-4 me-2 text-primary"></i>
											<span
												className="text-muted fs-5"
												itemProp="additionalProperty"
												itemScope
												itemType="https://schema.org/PropertyValue"
											>
												<meta itemProp="name" content="Suítes" />
												<span itemProp="value">
													{propertyData.preview?.suite}
												</span>
											</span>
										</span>
									</li>

									<li className="list-inline-item">
										<span className="d-flex align-items-center">
											<i className="mdi mdi-car fs-4 me-2 text-primary"></i>
											<span
												className="text-muted fs-5"
												itemProp="additionalProperty"
												itemScope
												itemType="https://schema.org/PropertyValue"
											>
												<meta itemProp="name" content="Vagas" />
												<span itemProp="value">
													{propertyData.preview?.parking}
												</span>
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

								{propertyData.description_embed && (
									<div className="card map border-0">
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
								<h5 className="mb-3">A partir de:</h5>

								<div className="d-flex align-items-center justify-content-between">
									<h5
										className="mb-0"
										itemProp="offers"
										itemScope
										itemType="https://schema.org/Offer"
									>
										<meta itemProp="priceCurrency" content="BRL" />
										<meta itemProp="price" content={propertyData.price} />
										<meta
											itemProp="availability"
											content="https://schema.org/InStock"
										/>
										{formatPrice(propertyData.price)}
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
									{propertyData.price && propertyData.min_area && (
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
								</div>

								<div className="d-flex mt-3">
									<Link href="#" className="btn btn-primary w-100 small me-2">
										Download Book
									</Link>
									<Link
										href={whatsappMessage(propertyData.id)}
										className="btn btn-primary w-100 small"
										aria-label="Agendar visita por WhatsApp"
									>
										Agendar Agora
									</Link>
								</div>

								<FinancingSimulation />
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
									<h4 className="title mb-3">Você também pode gostar</h4>
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
