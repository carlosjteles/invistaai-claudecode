import Link from "next/link";

import prisma from "../../db/prisma";

import FeaturedPropertyCard from "./FeaturedPropertyCard";

export default async function FeaturedProperties() {
	const propertyData = await prisma.property.findMany({
		where: {
			images: {
				some: {},
			},
		},
		take: 6,
		include: {
			images: {
				select: {
					id: true,
					src: true,
					alt: true,
				},
				where: {
					thumbnail: true,
				},
				take: 1,
			},
		},
		orderBy: {
			id: "desc",
		},
	});

	if (!propertyData || propertyData.length === 0) {
		return null;
	}

	const handleCardClick = (slug) => {
		router.push(`/imovel/${slug}`);
	};

	const handleIconClick = (e, path) => {
		e.stopPropagation();
		router.push(path);
	};

	return (
		<>
			<div className="row justify-content-center">
				<div className="col">
					<div className="section-title text-center mb-4 pb-2">
						<h4 className="title mb-3">Imóveis em destaque</h4>
						<p className="text-muted para-desc mb-0 mx-auto">
							Veja os imóveis em destaque com localização e preço estratégicos.
						</p>
					</div>
				</div>
			</div>

			<div
				className="row g-4 mt-0"
				itemScope
				itemType="https://schema.org/ItemList"
			>
				<meta itemProp="name" content="Imóveis em destaque" />
				<meta itemProp="itemListOrder" content="Unordered" />
				<meta itemProp="numberOfItems" content={propertyData.length} />

				{propertyData.map((item, index) => {
					const thumbnail = item.images?.[0] || null;

					return (
						<div
							className="col-lg-4 col-md-6 col-12"
							key={index}
							itemProp="itemListElement"
							itemScope
							itemType="https://schema.org/ListItem"
						>
							<meta itemProp="position" content={index + 1} />

							<FeaturedPropertyCard item={item} thumbnail={thumbnail} />
						</div>
					);
				})}

				<div className="col-12 mt-4 pt-2">
					<div className="text-center">
						<Link href="/imoveis" className="mt-3 fs-6 text-primary">
							Veja mais opções{" "}
							<i className="mdi mdi-arrow-right align-middle"></i>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
