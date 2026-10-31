"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollTop from "../components/ScrollTop";

import {
	bedrooms,
	categories,
	parkingSpaces,
	suites,
} from "../storage/filters";

import { FiHome, FiCamera } from "../assets/icons/vander";

import { formatPrice } from "../helper/formatter";
import { getBaseUrl } from "../helper/utils";

import Pagination from "../components/Pagination";

export default function PropertiesClient({
	initialProperties,
	initialCategory,
	totalPages,
	totalCount,
	currentPage,
}) {
	const pathname = usePathname();
	const router = useRouter();
	const queryParams = useSearchParams();

	/** Filters */
	const [searchTerm, setSearchTerm] = React.useState(
		queryParams.get("q") || ""
	);
	const [category, setCategory] = React.useState(initialCategory);
	const [bedroom, setBedroom] = React.useState(
		queryParams.get("quartos") || "all"
	);
	const [parking, setParking] = React.useState(
		queryParams.get("vagas") || "all"
	);
	const [suite, setSuite] = React.useState(queryParams.get("suites") || "all");
	const [minPrice, setMinPrice] = React.useState(
		queryParams.get("preco-min") || 0
	);
	const [maxPrice, setMaxPrice] = React.useState(
		queryParams.get("preco-max") || 9999999999
	);

	const activeFilters =
		[...queryParams.keys()].some((key) => key !== "page") ||
		initialCategory !== 0;
	const propertyData = initialProperties;

	const clearFilters = () => {
		if (queryParams.size > 0) {
			setSearchTerm("");
			setCategory(0);
			setBedroom("all");
			setParking("all");
			setSuite("all");
		}

		router.push("/imoveis");
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const params = new URLSearchParams();

		if (searchTerm) params.set("q", searchTerm);
		if (category !== 0) params.set("categoria", category);
		if (bedroom !== "all") params.set("quartos", bedroom);
		if (parking !== "all") params.set("vagas", parking);
		if (suite !== "all") params.set("suites", suite);
		if (minPrice > 0) params.set("preco-min", minPrice);
		if (maxPrice < 9999999999) params.set("preco-max", maxPrice);

		params.delete("page");

		router.push(`${pathname}?${params.toString()}`);
	};

	const handlePageChange = (page) => {
		const params = new URLSearchParams(queryParams);

		if (page > 1) {
			params.set("page", page);
		} else {
			params.delete("page");
		}

		router.push(`${pathname}?${params.toString()}`);
	};

	const propertiesJsonLd = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: "Imóveis à Venda em São Paulo",
		description:
			"Explore nossa seleção de apartamentos, studios e imóveis em São Paulo com o melhor custo-benefício.",
		url: `${getBaseUrl()}/imoveis`,
		mainEntity: {
			"@type": "ItemList",
			itemListElement: propertyData.map((property, index) => ({
				"@type": "ListItem",
				position: (currentPage - 1) * 8 + index + 1,
				item: {
					"@type": "RealEstateListing",
					name: property.name || property.address,
					image: property.images?.[0]?.src || "",
					url: `${getBaseUrl()}/imovel/${property.slug}`,
					offers:
						property.price === 0
							? {
									"@type": "Offer",
									price: "Consulte",
									priceCurrency: "BRL",
									availability: "https://schema.org/PreOrder",
							  }
							: {
									"@type": "Offer",
									price: property.price,
									priceCurrency: "BRL",
									availability: "https://schema.org/InStock",
							  },
				},
			})),
			numberOfItems: totalCount,
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
			],
		},
		potentialAction: [
			{
				"@type": "SearchAction",
				target: `${getBaseUrl()}/imoveis?q={search_term_string}&categoria={categoria}&quartos={quartos}&vagas={vagas}&suites={suites}&preco-min={min_price}&preco-max={max_price}`,
				"query-input": [
					"required name=search_term_string",
					"optional name=categoria",
					"optional name=quartos",
					"optional name=vagas",
					"optional name=suites",
					"optional name=min_price",
					"optional name=max_price",
				],
			},
		],
	};

	return (
		<>
			<script
				id="properties-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(propertiesJsonLd).replace(/</g, "\\u003c"),
				}}
			/>

			<Navbar
				navClass="defaultscroll sticky"
				logolight={true}
				menuClass="navigation-menu nav-center nav-light"
				currentPath={pathname}
			/>

			<section
				className="bg-half-170 d-table w-100"
				style={{ backgroundImage: "url('/images/bg/properties.webp')" }}
			>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<p className="text-white-50 para-desc mx-auto mb-0">
									Selecionamos oportunidades imperdíveis para você
								</p>
								<h1 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
									Explore Nossas Ofertas
								</h1>
							</div>
						</div>
					</div>
					<div className="position-middle-bottom">
						<nav aria-label="breadcrumb" className="d-block">
							<ul
								className="breadcrumb breadcrumb-muted mb-0 p-0"
								itemScope
								itemType="https://schema.org/BreadcrumbList"
							>
								<li
									className="breadcrumb-item"
									itemProp="itemListElement"
									itemScope
									itemType="https://schema.org/ListItem"
								>
									<Link href="/">
										<span itemProp="name">Início</span>
									</Link>
									<meta itemProp="position" content="1" />
									<meta itemProp="item" content={`${getBaseUrl()}`} />
								</li>
								<li
									className="breadcrumb-item active"
									aria-current="page"
									itemProp="itemListElement"
									itemScope
									itemType="https://schema.org/ListItem"
								>
									<span itemProp="name">Imóveis</span>
									<meta itemProp="position" content="2" />
									<meta itemProp="item" content={`${getBaseUrl()}/imoveis`} />
								</li>
							</ul>
						</nav>
					</div>
				</div>
			</section>
			<div className="position-relative">
				<div className="shape overflow-hidden text-white">
					<svg
						viewBox="0 0 2880 48"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
							fill="currentColor"
						></path>
					</svg>
				</div>
			</div>
			<section className="section">
				<div className="container">
					<div className="row g-4">
						<div className="col-lg-4 col-md-6 col-12">
							<form
								onSubmit={handleSubmit}
								className="card bg-white p-4 rounded-3 shadow sticky-bar"
								role="search"
								aria-label="Filtro de imóveis"
								itemScope
								itemType="https://schema.org/WebSite"
							>
								<meta itemProp="url" content={`${getBaseUrl()}/imoveis`} />

								<h6 className="mb-0">Buscar Imóveis</h6>
								<input
									type="text"
									className="form-control rounded-3 border"
									name="q"
									placeholder="O que você está procurando?"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>

								<div className="mt-4">
									<h6 className="mb-0">Categorias</h6>
									<select
										className="form-select form-control border mt-2"
										aria-label="Filtrar por Categorias"
										name="categoria"
										value={category}
										onChange={(e) => setCategory(Number(e.target.value))}
									>
										<option value="">Selecione ...</option>
										{categories.map((item) => (
											<option key={item.id} value={item.id}>
												{item.label}
											</option>
										))}
									</select>
								</div>
								<div className="mt-4">
									<h6 className="mb-0">Quartos</h6>
									<select
										className="form-select form-control border mt-2"
										aria-label="Filtrar por Quartos"
										name="quartos"
										value={bedroom}
										onChange={(e) => setBedroom(e.target.value)}
									>
										<option value="all">Selecione ...</option>
										{bedrooms.map((item) => (
											<option key={item} value={item}>
												{item}
											</option>
										))}
									</select>
								</div>
								<div className="mt-4">
									<h6 className="mb-0">Suítes</h6>
									<select
										className="form-select form-control border mt-2"
										aria-label="Filtrar por Suítes"
										name="suites"
										value={suite}
										onChange={(e) => setSuite(e.target.value)}
									>
										<option value="all">Selecione ...</option>
										{suites.map((item) => (
											<option key={item} value={item}>
												{item}
											</option>
										))}
									</select>
								</div>

								<div className="mt-4">
									<h6 className="mb-0">Vagas de Estacionamento</h6>
									<select
										className="form-select form-control border mt-2"
										aria-label="Filtrar por Vagas de Estacionamento"
										name="vagas"
										value={parking}
										onChange={(e) => setParking(e.target.value)}
									>
										<option value="all">Selecione ...</option>
										{parkingSpaces.map((item) => (
											<option key={item} value={item}>
												{item}
											</option>
										))}
									</select>
								</div>

								<div className="mt-4 d-flex flex-column justify-content-between gap-3 align-items-center">
									<button className="btn btn-primary w-100">
										Aplicar Filtros
									</button>
									{activeFilters && (
										<button
											type="button"
											className="btn btn-link btn-sm ms-2 p-0"
											onClick={clearFilters}
										>
											Limpar filtros
										</button>
									)}
								</div>
							</form>
						</div>
						{propertyData.length > 0 ? (
							<div
								className="col-lg-8 col-md-6 col-12"
								itemScope
								itemType="https://schema.org/ItemList"
							>
								<meta itemProp="numberOfItems" content={totalCount} />
								<meta itemProp="itemListOrder" content="Unordered" />
								<meta itemProp="name" content="Imóveis à Venda" />

								<div className="row g-4">
									{propertyData.map((item, index) => {
										const itemUrl = `${getBaseUrl()}/imovel/${item.slug}`;
										const thumbnail = item.images?.[0] || null;

										return (
											<div
												className="col-lg-6 col-12"
												key={index}
												itemProp="itemListElement"
												itemScope
												itemType="https://schema.org/ListItem"
											>
												<meta
													itemProp="position"
													content={(currentPage - 1) * 8 + index + 1}
												/>
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
																sizes="100vw"
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
																		<FiHome
																			className="icons"
																			aria-hidden="true"
																		/>
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
																		<FiCamera
																			className="icons"
																			aria-hidden="true"
																		/>
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
								</div>

								<Pagination
									currentPage={currentPage}
									setCurrentPage={handlePageChange}
									totalPages={totalPages}
								/>
							</div>
						) : (
							<div className="col-lg-8 col-md-6 col-12">
								<div className="text-center p-5">
									<h4>
										Nenhum imóvel encontrado
										{activeFilters && " com os filtros selecionados"}
									</h4>
									{activeFilters && (
										<button
											className="btn btn-primary mt-3"
											onClick={clearFilters}
										>
											Limpar todos os filtros
										</button>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</section>
			<Footer />
			<ScrollTop />
		</>
	);
}
