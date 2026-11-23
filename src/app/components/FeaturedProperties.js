import Link from "next/link";
import Image from "next/image";

import { FiHome, FiCamera } from "../assets/icons/vander";

import { formatPrice } from "../helper/formatter";
import { getBaseUrl, ordenarPorEntrega } from "../helper/utils";

import prisma from "../../db/prisma";
import Mdi from "./Mdi";
import PropertyCard from "./PropertyCard";

export const revalidate = 300;

export default async function FeaturedProperties() {
	const todos = await prisma.property.findMany({
		where: {
			images: {
				some: {},
			},
		},
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
	});

	// Entrega mais distante primeiro (lançamentos à frente, prontos por último)
	const propertyData = ordenarPorEntrega(todos).slice(0, 12);

	if (!propertyData || propertyData.length === 0) {
		return null;
	}

	return (
		<>
			<div className="row justify-content-center">
				<div className="col">
					<div className="section-title text-center mb-4 pb-2">
						<h2 className="title h4 mb-3">Imóveis em destaque</h2>
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
					const itemUrl = `${getBaseUrl()}/imovel/${item.slug}`;

					return (
						<div
							className="col-lg-4 col-md-6 col-12"
							key={index}
							itemProp="itemListElement"
							itemScope
							itemType="https://schema.org/ListItem"
						>
							<meta itemProp="position" content={index + 1} />
							<meta itemProp="url" content={itemUrl} />
							<meta itemProp="name" content={item.name} />

							<PropertyCard item={item} />
						</div>
					);
				})}

				<div className="col-12 mt-4 pt-2">
					<div className="text-center">
						<Link href="/imoveis" className="mt-3 fs-6 text-primary">
							Veja mais opções{" "}
							<Mdi n="arrow-right" className="align-middle" />
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
