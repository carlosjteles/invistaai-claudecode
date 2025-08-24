"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollTop from "../components/ScrollTop";
import Pagination from "../components/Pagination";

import { blogData } from "../storage/data";

import { getBaseUrl, getSiteName } from "../helper/Utils";
import { formatDateISO, formatDateUS } from "../helper/Formatter";

export default function BlogsClient() {
	const [currentPage, setCurrentPage] = React.useState(1);
	const [inputValue, setInputValue] = React.useState("");
	const [searchTerm, setSearchTerm] = React.useState("");

	const searchParams = useSearchParams();
	const tagParam = searchParams.get("tag");
	const searchParam = searchParams.get("q");

	console.log("Search Param:", searchParam);

	const router = useRouter();

	React.useEffect(() => {
		if (searchParam) {
			setInputValue(searchParam);
			setSearchTerm(searchParam);

			if (currentPage > 1) {
				setCurrentPage(1);
			}
		}
	}, [currentPage, searchParam]);

	React.useEffect(() => {
		if (inputValue.length > 3) {
			const timer = setTimeout(() => {
				setSearchTerm(inputValue);

				if (currentPage > 1) {
					setCurrentPage(1);
				}
			}, 500);

			return () => clearTimeout(timer);
		} else {
			setSearchTerm("");
		}
	}, [currentPage, inputValue]);

	const recentData = React.useMemo(() => {
		return [...blogData]
			.map((item) => ({
				...item,
				parsedDate: (() => formatDateUS(item.date))(),
			}))
			.sort((a, b) => b.parsedDate - a.parsedDate)
			.slice(0, 3)
			.map(({ parsedDate, ...item }) => item);
	}, []);

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
	}, [searchTerm, tagParam]);

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
		[]
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

	const blogsJsonLd = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: "Blog e Notícias sobre Imóveis",
		description:
			"Conteúdo especializado sobre mercado imobiliário, dicas para investidores e tendências.",
		url: `${getBaseUrl()}/blogs`,
		mainEntity: {
			"@type": "ItemList",
			itemListElement: paginatedData.map((post, index) => ({
				"@type": "ListItem",
				position: itemsPerPage * (currentPage - 1) + index + 1,
				item: {
					"@type": "BlogPosting",
					headline: post.title,
					description: post.desc,
					image: `${getBaseUrl()}${post.image}`,
					url: `${getBaseUrl()}/blog/${post.slug}`,
					datePublished: formatDateISO(post.date),
					author: {
						"@type": "Organization",
						name: getSiteName(),
					},
					publisher: {
						"@type": "Organization",
						name: getSiteName(),
						logo: {
							"@type": "ImageObject",
							url: `${getBaseUrl()}/logo.png`,
						},
					},
					keywords: post.tag,
				},
			})),
			numberOfItems: filteredData.length,
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Início",
					item: getBaseUrl(),
				},
				{
					"@type": "ListItem",
					position: 2,
					name: "Notícias",
					item: `${getBaseUrl()}/blogs`,
				},
			],
		},
	};

	return (
		<>
			<Script
				id="blogs-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(blogsJsonLd) }}
			/>

			<Navbar
				navClass="defaultscroll sticky"
				logolight={true}
				menuClass="navigation-menu nav-left nav-light"
			/>
			<section
				className="bg-half-170 d-table w-100"
				style={{ backgroundImage: "url('/images/bg/blogs.webp')" }}
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
								</li>
								<li
									className="breadcrumb-item active"
									aria-current="page"
									itemProp="itemListElement"
									itemScope
									itemType="https://schema.org/ListItem"
								>
									<span itemProp="name">Notícias</span>
									<meta itemProp="position" content="2" />
									<meta itemProp="item" content={`${getBaseUrl()}/blogs`} />
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
							<div
								className="col-lg-8 col-md-6 col-12"
								itemScope
								itemType="https://schema.org/Blog"
							>
								<div
									className="row g-4"
									itemScope
									itemType="https://schema.org/ItemList"
								>
									<meta
										itemProp="numberOfItems"
										content={filteredData.length}
									/>
									<meta itemProp="itemListOrder" content="Unordered" />

									{paginatedData.map((item, index) => {
										return (
											<div
												className="col-lg-6"
												key={index}
												itemProp="itemListElement"
												itemScope
												itemType="https://schema.org/ListItem"
											>
												<meta
													itemProp="position"
													content={itemsPerPage * (currentPage - 1) + index + 1}
												/>

												<div
													className="card blog blog-primary shadow rounded-3 overflow-hidden border-0"
													itemScope
													itemType="https://schema.org/BlogPosting"
												>
													<meta
														itemProp="datePublished"
														content={formatDateISO(item.date)}
													/>
													<meta itemProp="author" content={item.author} />
													<meta itemProp="keywords" content={item.tag} />

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
																itemProp="image"
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
																itemProp="url"
															>
																<span itemProp="headline">{item.title}</span>
															</Link>
															<p
																className="text-muted mt-2"
																itemProp="description"
															>
																{item.desc}
															</p>

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
										<div
											className="menu-search mb-0"
											itemScope
											itemType="https://schema.org/WebSite"
										>
											<meta itemProp="url" content={`${getBaseUrl()}/blogs`} />
											<div
												itemProp="potentialAction"
												itemScope
												itemType="https://schema.org/SearchAction"
											>
												<meta
													itemProp="target"
													content={`${getBaseUrl()}/blogs?q={search_term_string}`}
												/>
												<input
													type="text"
													className="form-control rounded-3 border"
													name="search"
													id="search"
													value={inputValue}
													onChange={handleInputChange}
													placeholder="O que você está procurando?"
													itemProp="query-input"
													aria-label="Buscar artigos"
													required
												/>
											</div>
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
								<div
									className="mt-4 pt-2"
									itemScope
									itemType="https://schema.org/ItemList"
								>
									<meta itemProp="name" content="Notícias Recentes" />
									<meta itemProp="itemListOrder" content="Unordered" />
									<meta itemProp="numberOfItems" content={recentData.length} />

									<h6 className="pt-2 pb-2 bg-light rounded-3 text-center">
										Notícias Recentes
									</h6>
									<div className="mt-4">
										{recentData.map((item, index) => {
											return (
												<div
													className="blog blog-primary d-flex align-items-center mt-3"
													key={index}
													itemProp="itemListElement"
													itemScope
													itemType="https://schema.org/ListItem"
												>
													<meta itemProp="position" content={index + 1} />
													<meta itemProp="name" content={item.title} />

													<div
														itemScope
														itemType="https://schema.org/BlogPosting"
													>
														<meta
															itemProp="datePublished"
															content={formatDateISO(item.date)}
														/>

														<Image
															src={item.image}
															width={105}
															height={65}
															className="avatar avatar-small rounded-3"
															style={{ width: "auto" }}
															alt={item.title}
															itemProp="image"
														/>
														<div className="flex-1 ms-3">
															<Link
																href={`/blog/${item.slug}`}
																className="d-block title text-dark fw-medium"
																itemProp="url"
															>
																<span itemProp="headline">{item.title}</span>
															</Link>
															<span className="text-muted small">
																{item.date}
															</span>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>

								<div
									className="mt-4 pt-2 text-center"
									itemScope
									itemType="https://schema.org/ItemList"
								>
									<meta itemProp="name" content="Categorias de Blog" />
									<meta itemProp="numberOfItems" content={tags.length} />

									<h6 className="pt-2 pb-2 bg-light rounded-3">Assuntos</h6>
									<ul className="tagcloud list-unstyled mt-4">
										{tags.map((tag, index) => (
											<li
												className="list-inline-item m-1"
												key={index}
												itemProp="itemListElement"
												itemScope
												itemType="https://schema.org/ListItem"
											>
												<meta itemProp="position" content={index + 1} />

												<Link
													href={`/blogs?tag=${encodeURIComponent(tag)}`}
													className="rounded-3 fw-medium text-dark inline-block py-2 px-3"
													itemProp="url"
												>
													<span itemProp="name">{tag}</span>
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
