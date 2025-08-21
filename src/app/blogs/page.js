"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";
import Pagination from "../components/pagination";

import { blogData } from "../storage/data";

export default function Blog() {
	const [currentPage, setCurrentPage] = React.useState(1);
	const [inputValue, setInputValue] = React.useState("");
	const [searchTerm, setSearchTerm] = React.useState("");

	const searchParams = useSearchParams();
	const tagParam = searchParams.get("tag");

	const router = useRouter();

	React.useEffect(() => {
		if (inputValue.length > 3) {
			const timer = setTimeout(() => {
				setSearchTerm(inputValue);
				setCurrentPage(1);
			}, 500);
			return () => clearTimeout(timer);
		} else {
			setSearchTerm("");
		}
	}, [inputValue]);

	const recentData = React.useMemo(() => {
		return [...blogData]
			.map((item) => ({
				...item,
				parsedDate: (() => {
					const [day, month, year] = item.date.split("/").map(Number);
					return new Date(year, month - 1, day);
				})(),
			}))
			.sort((a, b) => b.parsedDate - a.parsedDate)
			.slice(0, 3)
			.map(({ parsedDate, ...item }) => item);
	}, [blogData]);

	const filteredData = React.useMemo(() => {
		return searchTerm || tagParam
			? blogData.filter((item) => {
					return (
						(!searchTerm ||
							item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
							item.desc.toLowerCase().includes(searchTerm.toLowerCase())) &&
						(!tagParam || item.tag.toLowerCase() === tagParam.toLowerCase())
					);
			  })
			: blogData;
	}, [searchTerm, tagParam, blogData]);

	const itemsPerPage = 8;
	const totalPages = Math.ceil(filteredData.length / itemsPerPage);

	const paginatedData = React.useMemo(() => {
		return filteredData.slice(
			itemsPerPage * (currentPage - 1),
			itemsPerPage * currentPage
		);
	}, [filteredData, currentPage, itemsPerPage]);

	const tags = React.useMemo(
		() => [...new Set(blogData.map((item) => item.tag))],
		[blogData]
	);

	const clearFilters = React.useCallback(
		(type) => {
			if (["all", "search"].includes(type)) {
				setSearchTerm("");
				setInputValue("");
			}

			setCurrentPage(1);

			if (["all", "tag"].includes(type)) {
				router.push("/blogs");
			}
		},
		[router]
	);

	const handleInputChange = React.useCallback((event) => {
		setInputValue(event.target.value);
	}, []);

	return (
		<>
			<Navbar
				navClass="defaultscroll sticky"
				logolight={true}
				menuClass="navigation-menu nav-left nav-light"
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
									Últimas Notícias
								</p>
								<h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
									Conteúdo & Insights
								</h5>
							</div>
						</div>
					</div>
					<div className="position-middle-bottom">
						<nav aria-label="breadcrumb" className="d-block">
							<ul className="breadcrumb breadcrumb-muted mb-0 p-0">
								<li className="breadcrumb-item">
									<Link href="/">Início</Link>
								</li>
								<li className="breadcrumb-item active" aria-current="page">
									Notícias
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
						{paginatedData.length > 0 ? (
							<div className="col-lg-8 col-md-6 col-12">
								<div className="row g-4">
									{paginatedData.map((item, index) => {
										return (
											<div className="col-lg-6" key={index}>
												<div className="card blog blog-primary shadow rounded-3 overflow-hidden border-0">
													<div className="card-img blog-image position-relative overflow-hidden rounded-0">
														<div className="position-relative overflow-hidden">
															<Image
																src={item.image}
																width={0}
																height={0}
																sizes="100vw"
																style={{ width: "100%", height: "auto" }}
																className="img-fluid"
																alt={item.title}
															/>
															<div className="card-overlay"></div>
														</div>

														<div className="blog-tag p-3">
															<Link
																href={`/blogs?tag=${encodeURIComponent(
																	item.tag
																)}`}
																className="badge bg-primary"
															>
																{item.tag}
															</Link>
														</div>
													</div>

													<div className="card-body content p-0">
														<div className="p-4">
															<Link
																href={`/blog/${item.slug}`}
																className="title fw-medium fs-5 text-dark"
															>
																{item.title}
															</Link>
															<p className="text-muted mt-2">{item.desc}</p>

															<Link
																href={`/blog/${item.slug}`}
																className="text-dark read-more"
															>
																Leia mais{" "}
																<i className="mdi mdi-chevron-right align-middle"></i>
															</Link>
														</div>
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
									<h4>Nenhum post encontrado com os filtros selecionados</h4>
									{searchTerm && searchTerm.length > 3 && (
										<button
											className="btn btn-primary mt-3"
											onClick={() => clearFilters("all")}
										>
											Limpar todos os filtros
										</button>
									)}
								</div>
							</div>
						)}

						<div className="col-lg-4 col-md-6 col-12">
							<div className="card bg-white p-4 rounded-3 shadow sticky-bar">
								<div>
									<h6 className="pt-2 pb-2 bg-light rounded-3 text-center">
										Buscar Notícias
									</h6>

									<div className="search-bar mt-4">
										<div className="menu-search mb-0">
											<input
												type="text"
												className="form-control rounded-3 border"
												name="search"
												id="search"
												value={inputValue}
												onChange={handleInputChange}
												placeholder="O que você está procurando?"
											/>
										</div>
									</div>

									{searchTerm && searchTerm.length > 3 && (
										<button
											type="button"
											className="btn btn-link btn-sm w-100 text-center"
											onClick={() => clearFilters("search")}
										>
											Limpar filtros
										</button>
									)}
								</div>
								<div className="mt-4 pt-2">
									<h6 className="pt-2 pb-2 bg-light rounded-3 text-center">
										Notícias Recentes
									</h6>
									<div className="mt-4">
										{recentData.map((item, index) => {
											return (
												<div
													className="blog blog-primary d-flex align-items-center mt-3"
													key={index}
												>
													<Image
														src={item.image}
														width={105}
														height={65}
														className="avatar avatar-small rounded-3"
														style={{ width: "auto" }}
														alt={item.title}
													/>
													<div className="flex-1 ms-3">
														<Link
															href={`/blog/${item.slug}`}
															className="d-block title text-dark fw-medium"
														>
															{item.title}
														</Link>
														<span className="text-muted small">
															{item.date}
														</span>
													</div>
												</div>
											);
										})}
									</div>
								</div>

								<div className="mt-4 pt-2 text-center">
									<h6 className="pt-2 pb-2 bg-light rounded-3">Assuntos</h6>
									<ul className="tagcloud list-unstyled mt-4">
										{tags.map((tag, index) => (
											<li className="list-inline-item m-1" key={index}>
												<Link
													href={`/blogs?tag=${encodeURIComponent(tag)}`}
													className="rounded-3 fw-medium text-dark inline-block py-2 px-3"
												>
													{tag}
												</Link>
											</li>
										))}
									</ul>
									{tagParam && (
										<button
											type="button"
											className="btn btn-link btn-sm ms-2 p-0"
											onClick={() => clearFilters("tag")}
										>
											Limpar filtros
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Footer />
			<ScrollTop />
		</>
	);
}
