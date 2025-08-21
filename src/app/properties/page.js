"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";

import { propertyData as data } from "../storage/data";

import {
	bedrooms,
	categories,
	parkingSpaces,
	suites,
} from "../storage/filters";

import { FiHome, FiCamera } from "../assets/icons/vander";

import { formatPrice } from "../helper/formatter";

import Pagination from "../components/pagination";

export default function Properties() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const [currentPage, setCurrentPage] = React.useState(1);
	const [searchTerm, setSearchTerm] = React.useState("");
	const [category, setCategory] = React.useState("all");
	const [bedroom, setBedroom] = React.useState("all");
	const [parking, setParking] = React.useState("all");
	const [suite, setSuite] = React.useState("all");
	const [minPrice, setMinPrice] = React.useState(0);
	const [maxPrice, setMaxPrice] = React.useState(9999999999);
	const [propertyData, setPropertyData] = React.useState(data);

	const itemsPerPage = 8;
	const totalPages = Math.ceil(propertyData.length / itemsPerPage);
	const paginatedData = propertyData.slice(
		itemsPerPage * (currentPage - 1),
		itemsPerPage * currentPage
	);

	const isAnyFilterActive =
		searchTerm !== "" ||
		category !== "all" ||
		bedroom !== "all" ||
		parking !== "all" ||
		suite !== "all";

	const clearFilters = React.useCallback(() => {
		const isReleases = pathname === "/lancamentos";

		if (searchParams.size > 0 || isReleases) {
			router.push("/imoveis");
		}

		console.log("Limpar filtros");

		setSearchTerm("");
		setCategory("all");
		setBedroom("all");
		setParking("all");
		setSuite("all");
		setPropertyData(data);

		if (currentPage > 1) {
			setCurrentPage(1);
		}
	}, [pathname, searchParams, router]);

	const getPropertyFiltered = React.useCallback(() => {
		return data.filter((item) => {
			return (
				(!searchTerm ||
					item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())) &&
				(category === "all" || item.category === Number(category)) &&
				(bedroom === "all" || item.bed === bedroom) &&
				(parking === "all" || item.parking === parking) &&
				(suite === "all" || item.suite === suite) &&
				item.price >= minPrice &&
				item.price <= maxPrice
			);
		});
	}, [data, searchTerm, category, bedroom, parking, suite, minPrice, maxPrice]);

	React.useEffect(() => {
		const release = categories.find((item) => item.label === "Lançamento");
		const isReleases = pathname === "/lancamentos";
		const isProperties = pathname === "/imoveis";

		// Clear filters, when was in "lancamentos" and changed to "imoveis"
		if (searchParams.size === 0 && isProperties && category === release.id) {
			clearFilters();
		}

		// If no search params and not in "lancamentos", return
		if (searchParams.size === 0 && !isReleases) {
			return;
		}

		const searchParam = searchParams.get("q");
		const minPriceParam = searchParams.get("preco-min");
		const maxPriceParam = searchParams.get("preco-max");
		let categoryParam = searchParams.get("categoria");

		// If in "lancamentos", set categoryParam to release.id
		if (isReleases) {
			categoryParam = release.id;
		}

		if (searchParam) {
			setSearchTerm(searchParam);
		}

		if (categoryParam) {
			setCategory(categoryParam);
		}

		if (minPriceParam) {
			setMinPrice(minPriceParam);
		}

		if (maxPriceParam) {
			setMaxPrice(maxPriceParam);
		}

		console.log("filtrando");

		setPropertyData(getPropertyFiltered());

		if (currentPage > 1) {
			setCurrentPage(1);
		}
	}, [searchParams, pathname, category, clearFilters]);

	const handleSubmit = (e) => {
		e.preventDefault();
		setPropertyData(getPropertyFiltered());
		setCurrentPage(1);
	};

	console.log("renderizando", searchParams);

	return (
		<>
			<Navbar
				navClass="defaultscroll sticky"
				logolight={true}
				menuClass="navigation-menu nav-left nav-light"
				currentPath={pathname}
			/>
			<section
				className="bg-half-170 d-table w-100"
				style={{ backgroundImage: "url('/images/bg/03.jpg')" }}
			>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<p className="text-white-50 para-desc mx-auto mb-0">
									Selecionamos oportunidades imperdíveis para você
								</p>
								<h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
									Explore Nossas Ofertas
								</h5>
							</div>
						</div>
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
							>
								<div>
									<h6 className="mb-0">Buscar Imóveis</h6>
									<input
										type="text"
										className="form-control rounded-3 border"
										placeholder="O que você está procurando?"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
								</div>
								<div className="mt-4">
									<h6 className="mb-0">Categorias</h6>
									<select
										className="form-select form-control border mt-2"
										aria-label="Filtrar por Categorias"
										value={category}
										onChange={(e) => setCategory(e.target.value)}
									>
										<option value="all">Selecione ...</option>
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
									{isAnyFilterActive && (
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
						{paginatedData.length > 0 ? (
							<div className="col-lg-8 col-md-6 col-12">
								<div className="row g-4">
									{paginatedData.map((item, index) => {
										return (
											<div className="col-lg-6 col-12" key={index}>
												<div className="card property border-0 shadow position-relative overflow-hidden rounded-3">
													<div className="property-image position-relative overflow-hidden shadow">
														<Image
															src={item.thumbnail}
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
								</div>

								<Pagination
									currentPage={currentPage}
									setCurrentPage={setCurrentPage}
									totalPages={totalPages}
								/>
							</div>
						) : (
							<div className="col-lg-8 col-md-6 col-12">
								<div className="text-center p-5">
									<h4>Nenhum imóvel encontrado com os filtros selecionados</h4>
									{isAnyFilterActive && (
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
