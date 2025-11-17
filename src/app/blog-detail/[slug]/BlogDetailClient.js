"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollTop from "../../components/ScrollTop";

import { formatDate, formatDateISO } from "../../helper/formatter";
import { getBaseUrl, getSiteName } from "../../helper/utils";

import Swal from "sweetalert2";

export default function BlogDetailClient({
	blogPost,
	recentPosts,
	relatedPosts,
	tags,
}) {
	const router = useRouter();

	const [search, setSearch] = React.useState("");

	const content = React.useMemo(() => {
		if (!blogPost.content) return [];

		try {
			if (typeof blogPost.content === "string") {
				const parsed = JSON.parse(blogPost.content);
				return Array.isArray(parsed)
					? parsed
					: [{ type: "text", value: parsed }];
			}

			if (Array.isArray(blogPost.content)) {
				return blogPost.content;
			}

			if (typeof blogPost.content === "object") {
				return [blogPost.content];
			}

			return [{ type: "text", value: String(blogPost.content) }];
		} catch (e) {
			return [{ type: "text", value: blogPost.content }];
		}
	}, [blogPost.content]);

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

	const articleBody = React.useMemo(() => {
		if (Array.isArray(blogPost.content)) {
			return blogPost.content
				.filter((item) => item.type === "text")
				.map((item) => item.value)
				.join(" ");
		}
		return blogPost.description;
	}, [blogPost.content, blogPost.description]);

	const blogSchema = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: blogPost.title,
		description: blogPost.description,
		image: blogPost.image,
		datePublished: formatDateISO(blogPost.createdAt),
		dateModified: formatDateISO(blogPost.updatedAt),
		author: {
			"@type": "Person",
			name: blogPost.author,
		},
		publisher: {
			"@type": "Organization",
			name: getSiteName(),
			logo: {
				"@type": "ImageObject",
				url: `${getBaseUrl()}/images/logo-dark.svg`,
			},
		},
		keywords: blogPost.keywords,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${getBaseUrl()}/blog/${blogPost.slug}`,
		},
		articleBody: articleBody,
	};

	const breadcrumbSchema = {
		"@context": "https://schema.org",
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
			{
				"@type": "ListItem",
				position: 3,
				name: blogPost.title,
				item: `${getBaseUrl()}/blog/${blogPost.slug}`,
			},
		],
	};

	return (
		<>
			<Script
				id="blog-post-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
			/>
			<Script
				id="breadcrumb-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
			/>

			<Navbar
				navClass="defaultscroll sticky"
				logolight={true}
				menuClass="navigation-menu nav-center nav-light"
			/>
			<section
				className="bg-half-170 d-table w-100"
				style={{ backgroundImage: "url('/images/bg/blog-detail.webp')" }}
			>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<span className="badge bg-primary">{blogPost.tag}</span>
								<h1 className="heading fw-semibold mb-0 sub-heading text-white title-dark mt-4">
									{blogPost.title}
								</h1>

								<ul className="list-inline text-center mb-0">
									<li className="list-inline-item mx-4 mt-4">
										<span className="text-white-50 d-block">Autor</span>
										<Link href="#" className="text-white title-dark">
											{blogPost.author}
										</Link>
									</li>

									<li className="list-inline-item mx-4 mt-4">
										<span className="text-white-50 d-block">Data</span>
										<span className="text-white title-dark">
											{formatDate(blogPost.createdAt)}
										</span>
									</li>
								</ul>
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
									<Link href="/" itemProp="item">
										<span itemProp="name">Início</span>
									</Link>

									<meta itemProp="position" content="1" />
								</li>
								<li
									className="breadcrumb-item"
									itemProp="itemListElement"
									itemScope
									itemType="https://schema.org/ListItem"
								>
									<Link href="/blogs" itemProp="item">
										<span itemProp="name">Notícias</span>
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
									<span itemProp="name">{blogPost.title}</span>
									<meta itemProp="position" content="3" />
									<meta
										itemProp="item"
										content={`${getBaseUrl()}/blog/${blogPost.slug}`}
									/>
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
								<meta itemProp="headline" content={blogPost.title} />
								<meta
									itemProp="datePublished"
									content={formatDateISO(blogPost.createdAt)}
								/>
								<meta itemProp="author" content={blogPost.author} />

								{blogPost.image && (
									<figure>
										<Image
											src={blogPost.image}
											width={0}
											height={0}
											sizes="100vw"
											style={{ width: "100%", height: "auto" }}
											className="img-fluid"
											alt={blogPost.title}
											itemProp="image"
										/>
									</figure>
								)}

								<div className="card-body" itemProp="articleBody">
									{content.map((item, idx) => {
										if (item.type === "text") {
											return (
												<p
													className="text-muted"
													key={idx}
													dangerouslySetInnerHTML={{ __html: item.value }}
												></p>
											);
										}
										if (item.type === "title") {
											return (
												<h2 className="h5 mb-3 text-dark" key={idx}>
													{item.value}
												</h2>
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

							{relatedPosts.length > 0 && (
								<div
									className="card shadow rounded-3 mt-4"
									itemScope
									itemType="https://schema.org/ItemList"
								>
									<meta itemProp="name" content="Notícias Relacionadas" />
									<meta
										itemProp="numberOfItems"
										content={relatedPosts.length}
									/>

									<div className="card-body">
										<h2 className="card-title h5 mb-0">
											Notícias Relacionadas :
										</h2>

										<div className="row g-4 mt-0">
											{relatedPosts.map((item, index) => {
												const imgSrc = item.thumbnail || item.image;

												return (
													<div
														className="col-lg-6"
														key={index}
														itemProp="itemListElement"
														itemScope
														itemType="https://schema.org/ListItem"
													>
														<meta itemProp="position" content={index + 1} />

														<div
															className="card blog blog-primary shadow rounded-3 overflow-hidden border-0"
															itemScope
															itemType="https://schema.org/BlogPosting"
														>
															<meta itemProp="headline" content={item.title} />
															<meta
																itemProp="description"
																content={item.description}
															/>
															<meta
																itemProp="datePublished"
																content={formatDateISO(item.createdAt)}
															/>
															<meta
																itemProp="url"
																content={`${getBaseUrl()}/blog/${item.slug}`}
															/>
															{item.author && (
																<meta itemProp="author" content={item.author} />
															)}

															<div className="card-img blog-image position-relative overflow-hidden rounded-0">
																<div className="position-relative overflow-hidden">
																	<Image
																		src={imgSrc}
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
																		<span itemProp="headline">
																			{item.title}
																		</span>
																	</Link>

																	<p
																		className="text-muted mt-2"
																		itemProp="description"
																	>
																		{item.description}
																	</p>

																	<Link
																		href={`/blog/${item.slug}`}
																		className="text-dark read-more"
																		aria-label={`Ler mais sobre ${item.title}`}
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
							)}
						</div>

						<div className="col-lg-4 col-md-6 col-12">
							<div className="card bg-white p-4 rounded-3 shadow sticky-bar">
								<div>
									<h6 className="pt-2 pb-2 bg-light rounded-3 text-center">
										Buscar Notícias
									</h6>

									<div className="search-bar mt-4">
										<div
											id="itemSearch"
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
												<form onSubmit={handleSubmit} className="searchform">
													<input
														type="text"
														className="form-control rounded-3 border"
														name="q"
														value={search}
														onChange={(e) => setSearch(e.target.value)}
														id="searchItemSubmit"
														placeholder="O que você está procurando?"
														itemProp="query-input"
														aria-label="Buscar no blog"
														required
													/>
													<input
														type="submit"
														id="searchItemSubmit"
														value="Buscar"
														aria-label="Executar busca"
													/>
												</form>
											</div>
										</div>
									</div>
								</div>
								{recentPosts && recentPosts.length > 0 && (
									<div
										className="mt-4 pt-2"
										itemScope
										itemType="https://schema.org/ItemList"
									>
										<meta itemProp="name" content="Notícias Recentes" />
										<meta
											itemProp="numberOfItems"
											content={recentPosts.length}
										/>

										<h6 className="pt-2 pb-2 bg-light rounded-3 text-center">
											Notícias Recentes
										</h6>
										<div className="mt-4">
											{recentPosts.map((item, index) => {
												const imgSrc = item.thumbnail || item.image;

												return (
													<div
														key={index}
														itemProp="itemListElement"
														itemScope
														itemType="https://schema.org/ListItem"
													>
														<meta itemProp="position" content={index + 1} />

														<div
															className="blog blog-primary d-flex align-items-center mt-3"
															itemScope
															itemType="https://schema.org/BlogPosting"
														>
															<meta itemProp="headline" content={item.title} />
															<meta
																itemProp="datePublished"
																content={formatDateISO(item.createdAt)}
															/>
															<meta
																itemProp="url"
																content={`${getBaseUrl()}/blog/${item.slug}`}
															/>

															<Image
																src={imgSrc}
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
																	{formatDate(item.createdAt)}
																</span>
															</div>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								)}

								{tags && tags.length > 0 && (
									<div
										className="mt-4 pt-2 text-center"
										itemScope
										itemType="https://schema.org/ItemList"
									>
										<meta itemProp="name" content="Assuntos" />
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
									</div>
								)}
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
