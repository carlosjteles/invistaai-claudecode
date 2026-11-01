import { notFound, permanentRedirect } from "next/navigation";

import PropertyDetailsClient from "./PropertyDetailsClient";

import { categories } from "../../storage/filters";

import prisma from "../../../db/prisma";

import { getBaseUrl, getSiteName } from "../../helper/utils";

export const revalidate = 300;

export async function generateMetadata({ params }) {
	try {
		const propertyData = await prisma.property.findUnique({
			where: { slug: params.slug },
			select: {
				id: true,
				name: true,
				address: true,
				neighborhood: true,
				category: true,
				preview: true,
				seo: true,
				slug: true,
				images: {
					where: { thumbnail: true },
					take: 1,
					select: {
						src: true,
						alt: true,
					},
				},
			},
		});

		if (!propertyData) {
			return {
				title: `Imóvel não encontrado | ${getSiteName()}`,
				description: "O imóvel que você está procurando não foi encontrado.",
			};
		}

		const category =
			categories.find((cat) => cat.id === propertyData.category)?.label || "";

		const mainImage =
			propertyData.images && propertyData.images.length > 0
				? propertyData.images[0].src
				: undefined;

		return {
			title:
				propertyData.seo?.title ||
				`${propertyData.name || propertyData.address} | ${getSiteName()}`,
			description:
				propertyData.seo?.description ||
				`${propertyData.preview?.area} com ${propertyData.preview?.bedroom} em ${propertyData.neighborhood}`,
			keywords:
				propertyData.seo?.keywords ||
				`imóvel, ${category}, ${propertyData.neighborhood}`,
			openGraph: {
				title:
					propertyData.seo?.title || propertyData.name || propertyData.address,
				description: propertyData.seo?.description,
				type: "article",
				url: `${getBaseUrl()}/imovel/${propertyData.slug}`,
				images: mainImage
					? [
							{
								url: mainImage,
								width: 1200,
								height: 630,
								alt: propertyData.name || propertyData.address,
							},
					  ]
					: [],
			},
			twitter: {
				card: "summary_large_image",
				title:
					propertyData.seo?.title || propertyData.name || propertyData.address,
				description: propertyData.seo?.description,
				images: mainImage ? [mainImage] : [],
			},
			alternates: {
				canonical: `${getBaseUrl()}/imovel/${propertyData.slug}`,
			},
			robots: {
				index: true,
				follow: true,
				"max-snippet": -1,
				"max-image-preview": "large",
			},
		};
	} catch (error) {
		return {
			title: `Imóvel | ${getSiteName()}`,
			description: "Confira as melhores oportunidades de imóveis.",
		};
	}
}

async function getRedirect(slug) {
	try {
		const rows = await prisma.$queryRaw`
			select destino from conteudo.redirecionamentos where origem = ${`/imovel/${slug}`} limit 1`;
		return rows[0]?.destino || null;
	} catch (e) {
		return null;
	}
}

async function getBairro(neighborhood) {
	if (!neighborhood) return null;
	try {
		const rows = await prisma.$queryRaw`
			select slug, nome, prep from conteudo.bairros where ativo and ${neighborhood} = any(bairros) order by ordem limit 1`;
		return rows[0] || null;
	} catch (e) {
		return null;
	}
}

async function getIncorporadora(nome) {
	if (!nome) return null;
	try {
		const rows = await prisma.$queryRaw`
			select slug, nome from conteudo.incorporadoras where ativo and nome = ${nome} limit 1`;
		return rows[0] || null;
	} catch (e) {
		return null;
	}
}

export default async function PropertyDetails({ params }) {
	const propertyData = await prisma.property.findUnique({
		where: { slug: params.slug },
		include: {
			images: {
				where: {
					OR: [
						{ type: "perspectives", thumbnail: false },
						{ NOT: { type: "perspectives" } },
					],
				},
			},
		},
	});

	if (!propertyData) {
		// Imóvel removido: redireciona (308) para a página do bairro ou para /imoveis
		const destino = await getRedirect(params.slug);
		if (destino) permanentRedirect(destino);
		notFound();
	}

	const bairro = await getBairro(propertyData.neighborhood);
	const incorporadora = await getIncorporadora(propertyData.seo?.developer);

	const relatedInclude = {
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
	};

	/** 1º: mesmo bairro; depois: faixa de preço parecida, para completar 6 */
	const relatedProperties = await prisma.property.findMany({
		where: {
			images: { some: {} },
			slug: { not: params.slug },
			neighborhood: propertyData.neighborhood,
		},
		include: relatedInclude,
		orderBy: { updatedAt: "desc" },
		take: 6,
	});

	if (relatedProperties.length < 6 && propertyData.price > 0) {
		const moreProperties = await prisma.property.findMany({
			where: {
				images: { some: {} },
				slug: {
					notIn: [params.slug, ...relatedProperties.map((item) => item.slug)],
				},
				price: {
					gte: propertyData.price * 0.6,
					lte: propertyData.price * 1.4,
				},
			},
			include: relatedInclude,
			orderBy: { updatedAt: "desc" },
			take: 6 - relatedProperties.length,
		});

		relatedProperties.push(...moreProperties);
	}

	return (
		<PropertyDetailsClient
			propertyData={propertyData}
			relatedProperties={relatedProperties}
			bairro={bairro}
			incorporadora={incorporadora}
			updatedLabel={new Date(propertyData.updatedAt).toLocaleDateString(
				"pt-BR",
				{ timeZone: "America/Sao_Paulo" }
			)}
		/>
	);
}
