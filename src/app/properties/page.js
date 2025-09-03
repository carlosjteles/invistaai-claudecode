import PropertiesClient from "./PropertiesClient";

import prisma from "../../db/prisma";

import { getBaseUrl, getSiteName } from "../helper/utils";

import { categories } from "../storage/filters";

export const dynamic = "force-dynamic";

export const metadata = {
	title: `Imóveis à Venda em São Paulo | ${getSiteName()}`,
	description:
		"Explore nossa seleção de apartamentos, studios e imóveis em São Paulo com o melhor custo-benefício. Filtros personalizados para encontrar seu imóvel ideal.",
	keywords: [
		"comprar imóvel",
		"imóveis à venda",
		"apartamentos São Paulo",
		"studios",
		"filtro de imóveis",
	],
	alternates: {
		canonical: `${getBaseUrl()}/imoveis`,
	},
	openGraph: {
		title: `Imóveis à Venda em São Paulo | ${getSiteName()}`,
		description:
			"Explore nossa seleção de apartamentos, studios e imóveis em São Paulo com o melhor custo-benefício.",
		url: `${getBaseUrl()}/imoveis`,
		type: "website",
		images: [
			{
				url: `${getBaseUrl()}/images/bg/properties.webp`,
				width: 1200,
				height: 630,
				alt: "Imóveis à venda em São Paulo",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: `@${getSiteName().toLowerCase()}`,
		title: `Imóveis à Venda em São Paulo | ${getSiteName()}`,
		description:
			"Explore nossa seleção de apartamentos, studios e imóveis em São Paulo.",
		images: [`${getBaseUrl()}/images/bg/properties.webp`],
	},
	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default async function Properties({ searchParams, params }) {
	/** Set category manually for "lancamentos" or param */
	const pathname = params?.pathname || "";
	let category = Number(searchParams.categoria || 0);

	if (pathname && pathname.includes("lancamentos")) {
		const release = categories.find((item) => item.label === "Lançamento");
		category = Number(release.id);
	}

	/** Set pagination parameters */
	const page = Number(searchParams.page) || 1;
	const itemsPerPage = 8;

	/** Set filter parameters */
	const bedroom = searchParams.quartos || "all";
	const parking = searchParams.vagas || "all";
	const suite = searchParams.suites || "all";
	const minPrice = searchParams["preco-min"] || 0;
	const maxPrice = searchParams["preco-max"] || 0;
	let searchTerm = searchParams.q || "";

	/** Set filters prisma */
	const filterWhere = {};
	const filterAnd = [];

	if (searchTerm) {
		if (searchTerm.startsWith("R. ") || searchTerm.startsWith("R ")) {
			searchTerm = searchTerm.replace("R. ", "Rua ").replace("R ", "Rua ");
		} else if (searchTerm.startsWith("Av. ") || searchTerm.startsWith("Av ")) {
			searchTerm = searchTerm
				.replace("Av. ", "Avenida ")
				.replace("Av ", "Avenida ");
		}

		filterAnd.push({
			OR: [
				{ address: { contains: searchTerm, mode: "insensitive" } },
				{ neighborhood: { contains: searchTerm, mode: "insensitive" } },
				{ name: { contains: searchTerm, mode: "insensitive" } },
			],
		});
	}

	if (category !== 0) {
		filterAnd.push({ category });
	}

	if (bedroom !== "all") {
		if (bedroom === "Studio") {
			filterAnd.push({
				bedroom: {
					array_contains: "Studio",
				},
			});
		} else if (bedroom.includes("4+")) {
			filterAnd.push({
				OR: Array.from({ length: 20 }, (_, i) => i + 4).map((num) => ({
					bedroom: { array_contains: num },
				})),
			});
		} else {
			const numBedrooms = parseInt(bedroom.match(/\d+/)[0]);
			filterAnd.push({
				bedroom: {
					array_contains: numBedrooms,
				},
			});
		}
	}

	if (suite !== "all") {
		if (suite.includes("4+")) {
			filterAnd.push({
				suite: {
					hasSome: [
						4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
					],
				},
			});
		} else {
			const numSuites = parseInt(suite.match(/\d+/)[0]);
			filterAnd.push({
				suite: {
					has: numSuites,
				},
			});
		}
	}

	if (parking !== "all") {
		if (parking.includes("4+")) {
			filterAnd.push({
				parking: {
					hasSome: [
						4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
					],
				},
			});
		} else {
			const numParking = parseInt(parking.match(/\d+/)[0]);
			filterAnd.push({
				parking: {
					has: numParking,
				},
			});
		}
	}

	if (minPrice) {
		filterAnd.push({
			price: {
				gte: Number(minPrice),
			},
		});
	}

	if (maxPrice) {
		filterAnd.push({
			price: {
				lte: Number(maxPrice),
			},
		});
	}

	if (filterAnd.length > 0) {
		filterWhere.AND = filterAnd;
	}

	const properties = await prisma.property.findMany({
		where: { ...filterWhere, images: { some: {} } },
		include: {
			images: {
				where: {
					thumbnail: true,
				},
				take: 1,
			},
		},
		orderBy: {
			id: "desc",
		},
		skip: (page - 1) * itemsPerPage,
		take: itemsPerPage,
	});

	/** Total pages */
	const totalCount = await prisma.property.count({ where: filterWhere });
	const totalPages = Math.ceil(totalCount / itemsPerPage);

	return (
		<PropertiesClient
			initialCategory={category}
			initialProperties={properties}
			totalPages={totalPages}
			totalCount={totalCount}
			currentPage={page}
		/>
	);
}
