import React from "react";
import Link from "next/link";
import Image from "next/image";
import { blogData } from "../storage/data";

export default function Blog() {
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
	}, []);

	return (
		<>
			<div className="row justify-content-center">
				<div className="col">
					<div className="section-title text-center mb-4 pb-2">
						<h4 className="title mb-3">Conteúdo & Insights</h4>
						<p className="text-muted para-desc mb-0 mx-auto">
							Artigos práticos sobre investimento, tendências e o mercado
							imobiliário atual.
						</p>
					</div>
				</div>
			</div>

			<div className="row g-4 mt-0">
				{recentData.map((item, index) => {
					return (
						<div className="col-lg-4 col-md-6" key={index}>
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
											href={`/blog/${item.id}`}
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
		</>
	);
}
