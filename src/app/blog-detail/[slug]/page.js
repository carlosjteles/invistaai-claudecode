import React from "react";
import Link from "next/link";
import Image from "next/image";

import Error from "../../error/page";

import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import ScrollTop from "../../components/scrollTop";

import { blogData as data } from "../../storage/data";

export default function BlogDetail(props) {
	const blogData = data.find((item) => item.slug === props.params.slug);

	if (!blogData) {
		return <Error />;
	}

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
	}, [data]);

	const relatedPosts = React.useMemo(() => {
		return data
			.filter(
				(item) => item.tag === blogData.tag && item.slug !== blogData.slug
			)
			.slice(0, 2);
	}, [data, blogData]);

	const tags = React.useMemo(
		() => [...new Set(data.map((item) => item.tag))],
		[data]
	);

	return (
		<>
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
									<Link href="/blogs">Blog & Notícias</Link>
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
							<div className="card border-0 shadow rounded-3 overflow-hidden">
								<Image
									src={blogData.image}
									width={0}
									height={0}
									sizes="100vw"
									style={{ width: "100%", height: "auto" }}
									className="img-fluid"
									alt={blogData.title}
								/>

								<div className="card-body">
									<p className="text-muted">
										The most well-known dummy text is the Lorem Ipsum, which is
										said to have originated in the 16th century. Lorem Ipsum is
										composed in a pseudo-Latin language which more or less
										corresponds to proper Latin. It contains a series of real
										Latin words. This ancient dummy text is also
										incomprehensible, but it imitates the rhythm of most
										European languages in Latin script. The advantage of its
										Latin origin and the relative meaninglessness of Lorum Ipsum
										is that the text does not attract attention to itself or
										distract the viewers attention from the layout.
									</p>
									<p className="text-muted">
										Thus, Lorem Ipsum has only limited suitability as a visual
										filler for German texts. If the fill text is intended to
										illustrate the characteristics of different typefaces, it
										sometimes makes sense to select texts containing the various
										letters and symbols specific to the output language.
									</p>

									<blockquote className="text-center mx-auto blockquote">
										<i className="mdi mdi-format-quote-open mdi-48px text-muted opacity-2 d-block"></i>{" "}
										The man who comes back through the door in the wall will
										never be quite the same as the man who went out.{" "}
										<small className="d-block text-muted mt-2">
											- Towntor Template
										</small>
									</blockquote>

									<p className="text-muted">
										There is now an abundance of readable dummy texts. These are
										usually used when a text is required purely to fill a space.
										These alternatives to the classic Lorem Ipsum texts are
										often amusing and tell short, funny or nonsensical stories.
									</p>

									<Link href="#" className="badge badge-link bg-primary ms-1">
										Minimal
									</Link>
									<Link href="#" className="badge badge-link bg-primary ms-1">
										Interior
									</Link>
									<Link href="#" className="badge badge-link bg-primary ms-1">
										Furniture
									</Link>
								</div>
							</div>

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
										<div id="itemSearch2" className="menu-search mb-0">
											<form
												role="search"
												method="get"
												id="searchItemform2"
												className="searchform"
											>
												<input
													type="text"
													className="form-control rounded-3 border"
													name="s"
													id="searchItem2"
													placeholder="O que você está procurando?"
												/>
												<input
													type="submit"
													id="searchItemsubmit2"
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
