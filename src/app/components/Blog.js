import React from "react";
import Link from "next/link";
import Image from "next/image";

import prisma from "../../db/prisma";

import { getBaseUrl, getSiteName } from "../helper/utils";
import { formatDateISO } from "../helper/formatter";
import Mdi from "./Mdi";

export default async function Blog() {
	const recentData = await prisma.blog.findMany({
		where: {
			OR: [{ thumbnail: { not: "" } }, { image: { not: "" } }],
		},
		orderBy: { createdAt: "desc" },
		take: 3,
	});

	if (recentData.length === 0) return null;

	return (
		<>
			<div
				className="row justify-content-center"
				itemScope
				itemType="https://schema.org/Blog"
			>
				<meta itemProp="name" content={`Blog da ${getSiteName()}`} />
				<meta itemProp="url" content={`${getBaseUrl()}/blogs`} />

				<div className="col">
					<div className="section-title text-center mb-4 pb-2">
						<h4 className="title mb-3" itemProp="headline">
							Conteúdo & Insights
						</h4>
						<p className="text-muted para-desc mb-0 mx-auto" itemProp="about">
							Artigos práticos sobre investimento, tendências e o mercado
							imobiliário atual.
						</p>
					</div>
				</div>
			</div>

			<div
				className="row g-4 mt-0"
				itemScope
				itemType="https://schema.org/ItemList"
			>
				<meta itemProp="name" content="Artigos Recentes" />
				<meta itemProp="numberOfItems" content={recentData.length} />
				<meta itemProp="itemListOrder" content="Unordered" />

				{recentData.map((item, index) => {
					const imageSrc = item.thumbnail || item.image;

					return (
						<div
							className="col-lg-4 col-md-6"
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
								<meta itemProp="description" content={item.description} />
								<meta
									itemProp="datePublished"
									content={formatDateISO(item.createdAt)}
								/>
								<meta
									itemProp="author"
									content={item.author || getSiteName()}
								/>
								<meta
									itemProp="url"
									content={`${getBaseUrl()}/blog/${item.slug}`}
								/>
								<meta itemProp="keywords" content={item.tag} />

								<div
									className="card-img blog-image position-relative overflow-hidden rounded-0"
									itemProp="image"
									itemScope
									itemType="https://schema.org/ImageObject"
								>
									<meta itemProp="url" content={imageSrc} />

									<div className="position-relative overflow-hidden">
										<Image
											src={imageSrc}
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
											href={`/blogs?tag=${encodeURIComponent(item.tag)}`}
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
											<span itemProp="name">{item.title}</span>
										</Link>
										<p className="text-muted mt-2" itemProp="abstract">
											{item.description}
										</p>

										<Link
											href={`/blog/${item.slug}`}
											className="text-dark read-more"
											aria-label={`Ler o artigo completo: ${item.title}`}
										>
											Leia mais{" "}
											<Mdi n="chevron-right" className="align-middle" />
										</Link>

										<div
											itemProp="publisher"
											itemScope
											itemType="https://schema.org/Organization"
										>
											<meta itemProp="name" content={getSiteName()} />
											<meta itemProp="url" content={getBaseUrl()} />
											<div
												itemProp="logo"
												itemScope
												itemType="https://schema.org/ImageObject"
											>
												<meta
													itemProp="url"
													content={`${getBaseUrl()}/images/logo-dark.svg`}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
}
