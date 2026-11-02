import React from "react";
import Link from "next/link";
import Image from "next/image";
import { homeCards } from "../storage/filters";

import prisma from "../../db/prisma";

export const revalidate = 300;

/** Cartões da Home: três por fase da obra e dois por tipo de unidade (coberturas e investimento). */
export default async function Categories() {
	const porCategoria = await prisma.property.groupBy({
		by: ["category"],
		where: { images: { some: {} } },
		_count: { _all: true },
	});
	const nCategoria = Object.fromEntries(porCategoria.map((i) => [i.category, i._count._all]));

	const nTipo = {};
	for (const card of homeCards.filter((c) => c.tipo)) {
		try {
			const [r] = await prisma.$queryRaw`
				select count(*)::int n from conteudo.ids_por_tipo(${card.tipo}) i
				where exists (select 1 from "PropertyImage" pi where pi."propertyId" = i)`;
			nTipo[card.tipo] = r?.n || 0;
		} catch (e) {
			nTipo[card.tipo] = 0;
		}
	}

	const total = (card) =>
		card.tipo ? nTipo[card.tipo] || 0 : card.categorias.reduce((s, c) => s + (nCategoria[c] || 0), 0);

	return (
		<>
			<div className="row justify-content-center">
				<div className="col">
					<div className="section-title mb-4 pb-2">
						<h2 className="title h4 mb-3">Encontre pelo momento da obra ou pelo tipo de imóvel</h2>
						<p className="text-muted para-desc mb-0">
							Lançamentos, imóveis em obras e prontos novos, além de coberturas e opções para gerar renda.
						</p>
					</div>
				</div>
			</div>

			<div
				className="row row-cols-lg-5 row-cols-md-3 row-cols-2 g-3 g-md-4 mt-0"
				itemScope
				itemType="https://schema.org/ItemList"
			>
				<meta itemProp="name" content="Categorias de imóveis" />
				<meta itemProp="itemListOrder" content="Unordered" />

				{homeCards.map((item, index) => (
					<div className="col" key={item.key} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
						<meta itemProp="position" content={index + 1} />
						<Link href={item.href} className="d-block categories position-relative overflow-hidden rounded-3 shadow h-100" itemProp="url">
							<div className="categoria-img position-relative">
								<Image
									src={item.image}
									fill
									sizes="(max-width: 768px) 50vw, 20vw"
									quality={60}
									style={{ objectFit: "cover" }}
									alt={item.label}
									itemProp="image"
								/>
							</div>
							<div className="p-3">
								<span className="title text-dark fs-5 fw-medium d-block" itemProp="name">
									{item.label}
								</span>
								<p className="text-muted small mb-0" itemProp="description">
									{total(item)} {total(item) === 1 ? "imóvel" : "imóveis"}
								</p>
							</div>
						</Link>
					</div>
				))}
			</div>
		</>
	);
}
