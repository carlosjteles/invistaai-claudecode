"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";

import Error from "../../error/page";

import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import ScrollTop from "../../components/scrollTop";

import { blogData as data } from "../../storage/data";

import { formatDateISO } from "../../helper/formatter";
import { getBaseUrl, getSiteName } from "../../helper/utils";

import Swal from "sweetalert2";

export default function BlogDetail(props) {
	const router = useRouter();

	const [search, setSearch] = React.useState("");

	const recentData = React.useMemo(() => {
		return [...data]
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
	}, []);

	const blogData = data.find((item) => item.slug === props.params.slug);

	const relatedPosts = React.useMemo(() => {
		if (!blogData) return [];

		return data
			.filter(
				(item) => item.tag === blogData.tag && item.slug !== blogData.slug
			)
			.slice(0, 2);
	}, [blogData]);

	const tags = React.useMemo(
		() => [...new Set(data.map((item) => item.tag))],
		[]
	);

	if (!blogData) {
		return <Error />;
	}

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!search || search.length < 3) {
			Swal.fire({
				icon: "error",
				title: "Digite pelo menos 3 caracteres para pesquisar um imóvel.",
				showConfirmButton: false,
				timer: 2500,
			});
			return;
		}

		router.push(`/blogs?${new URLSearchParams({ q: search })}`);

		setSearch("");
	};

	const blogSchema = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: blogData.title,
		description: blogData.desc,
		image: `${getBaseUrl()}${blogData.image}`,
		datePublished: formatDateISO(blogData.date),
		author: {
			"@type": "Person",
			name: blogData.author,
		},
		publisher: {
			"@type": "Organization",
			name: getSiteName(),
			logo: {
				"@type": "ImageObject",
				url: `${getBaseUrl()}/logo.png`,
			},
		},
		keywords: blogData.keywords,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${getBaseUrl()}/blog/${blogData.slug}`,
		},
	};

	return (
		<>
			<Script
				id="blog-post-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
			/>

			<Navbar
				navClass="defaultscroll sticky"
				logolight={true}
				menuClass="navigation-menu nav-left nav-light"
			/>
			<section
				className="bg-half-170 d-table w-100"
				style={{ backgroundImage: "url('/images/bg/02.jpg')" }}
			>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<span className="badge bg-primary">{blogData.tag}</span>
								<h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark mt-4">
									{blogData.title}
								</h5>

								<ul className="list-inline text-center mb-0">
									<li className="list-inline-item mx-4 mt-4">
										<span className="text-white-50 d-block">Autor</span>
										<Link href="#" className="text-white title-dark">
											{blogData.author}
										</Link>
									</li>

									<li className="list-inline-item mx-4 mt-4">
										<span className="text-white-50 d-block">Data</span>
										<span className="text-white title-dark">
											{blogData.date}
										</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="position-middle-bottom">
						<nav aria-label="breadcrumb" className="d-block">
							<ul className="breadcrumb breadcrumb-muted mb-0 p-0">
								<li className="breadcrumb-item">
									<Link href="/">Início</Link>
								</li>
								<li className="breadcrumb-item">
									<Link href="/blogs">Notícias</Link>
								</li>
								<li className="breadcrumb-item active" aria-current="page">
									{blogData.title}
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
						<div className="col-lg-8 col-md-7">
							<article
								itemScope
								itemType="https://schema.org/BlogPosting"
								className="card border-0 shadow rounded-3 overflow-hidden"
							>
								<meta itemProp="headline" content={blogData.title} />
								<meta
									itemProp="datePublished"
									content={formatDateISO(blogData.date)}
								/>
								<meta itemProp="author" content={blogData.author} />

								<figure>
									<Image
										src={blogData.image}
										width={0}
										height={0}
										sizes="100vw"
										style={{ width: "100%", height: "auto" }}
										className="img-fluid"
										alt={blogData.title}
										itemProp="image"
									/>
								</figure>

								<div className="card-body" itemProp="articleBody">
									{blogData.content.map((item, idx) => {
										if (item.type === "text") {
											return (
												<p className="text-muted" key={idx}>
													{item.value}
												</p>
											);
										}
										if (item.type === "quote") {
											return (
												<blockquote
													className="text-center mx-auto blockquote"
													key={idx}
												>
													<i className="mdi mdi-format-quote-open mdi-48px text-muted opacity-2 d-block"></i>
													{item.value}
													{item.author && (
														<small className="d-block text-muted mt-2">
															{item.author}
														</small>
													)}
												</blockquote>
											);
										}
										if (item.type === "link") {
											return (
												<Link
													href={item.href}
													className="badge badge-link bg-primary ms-1"
													key={idx}
												>
													{item.value}
												</Link>
											);
										}
										if (item.type === "image" && item.src) {
											return (
												<Image
													src={item.src}
													width={0}
													height={0}
													sizes="100vw"
													style={{ width: "100%", height: "auto" }}
													className="img-fluid"
													alt={item.value}
													key={idx}
												/>
											);
										}
										return null;
									})}
								</div>
							</article>

							<div className="card shadow rounded-3 mt-4">
								<div className="card-body">
									<h5 className="card-title mb-0">Notícias Relacionadas :</h5>

									<div className="row g-4 mt-0">
										{relatedPosts.map((item, index) => {
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
																	Leia Mais{" "}
																	<i className="mdi mdi-chevron-right align-middle"></i>
																</Link>
															</div>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</div>

						<div className="col-lg-4 col-md-6 col-12">
							<div className="card bg-white p-4 rounded-3 shadow sticky-bar">
								<div>
									<h6 className="pt-2 pb-2 bg-light rounded-3 text-center">
										Buscar Notícias
									</h6>

									<div className="search-bar mt-4">
										<div id="itemSearch" className="menu-search mb-0">
											<form onSubmit={handleSubmit} className="searchform">
												<input
													type="text"
													className="form-control rounded-3 border"
													name="q"
													value={search}
													onChange={(e) => setSearch(e.target.value)}
													id="searchItemSubmit"
													placeholder="O que você está procurando?"
												/>
												<input
													type="submit"
													id="searchItemSubmit"
													value="Buscar"
												/>
											</form>
										</div>
									</div>
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
