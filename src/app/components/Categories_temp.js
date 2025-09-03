import React from "react";
import Link from "next/link";
import Image from "next/image";
import { categories } from "../storage/filters";

import prisma from "../../db/prisma";

export default async function Categories() {
	const categoryCountsArray = await prisma.property.groupBy({
		by: ["category"],
		where: {
			images: {
				some: {},
			},
		},
		_count: {
			_all: true,
		},
	});

	const countByCategory = Object.fromEntries(
		categoryCountsArray.map((item) => [item.category, item._count._all])
	);

	const CategoryListing = (id) => {
		return `${countByCategory[id] || 0} imóveis disponíveis`;
	};

	return (
		<>
			<div className="row justify-content-center">
				<div className="col">
					<div className="section-title mb-4 pb-2">
						<h4 className="title mb-3">Categorias de Imóveis</h4>
						<p className="text-muted para-desc mb-0">
							Navegue por categorias exclusivas e encontre com facilidade o
							imóvel perfeito para você comprar sem complicação.
						</p>
					</div>
				</div>
			</div>

			<div
				className="row row-cols-lg-5 row-cols-md-3 row-cols-sm-2 row-cols-1 g-4 mt-0"
				itemScope
				itemType="https://schema.org/ItemList"
			>
				<meta itemProp="name" content="Categorias de Imóveis" />
				<meta itemProp="itemListOrder" content="Unordered" />

				{categories.map((item, index) => {
					return (
						<div
							className="col"
							key={index}
							itemProp="itemListElement"
							itemScope
							itemType="https://schema.org/ListItem"
						>
							<meta itemProp="position" content={index + 1} />

							<div className="categories position-relative overflow-hidden rounded-3 shadow">
								<Image
									src={item.image}
									width={0}
									height={0}
									sizes="100vw"
									style={{ width: "100%", height: "auto" }}
									className="img-fluid"
									alt={item.label}
									itemProp="image"
								/>

								<div className="p-3">
									<Link
										href={`/imoveis?categoria=${encodeURIComponent(item.id)}`}
										className="title text-dark fs-5 fw-medium"
										itemProp="url"
									>
										<span itemProp="name">{item.label}</span>
									</Link>
									<p className="text-muted small mb-0" itemProp="description">
										{CategoryListing(item.id)}
									</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
}
