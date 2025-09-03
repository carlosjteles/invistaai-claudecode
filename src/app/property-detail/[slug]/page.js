import { notFound } from "next/navigation";

import PropertyDetailsClient from "./PropertyDetailsClient";

import { categories } from "../../storage/filters";

import prisma from "../../../db/prisma";

import { getBaseUrl, getSiteName } from "../../helper/utils";

export async function generateMetadata({ params }) {
	const propertyData = await prisma.property.findUnique({
		where: { slug: params.slug, images: { some: {} } },
		include: {
			images: true,
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
			? `${getBaseUrl()}${propertyData.images[0].src}`
			: propertyData.image
			? `${getBaseUrl()}${propertyData.image}`
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
}

export default async function PropertyDetails({ params }) {
	const propertyData = await prisma.property.findUnique({
		where: { slug: params.slug, images: { some: {} } },
		include: {
			images: true,
		},
	});

	if (!propertyData) {
		notFound();
	}

	const relatedProperties = await prisma.property.findMany({
		where: {
			images: { some: {} },
			slug: { not: params.slug },
			neighborhood: propertyData.neighborhood,
			price: {
				gte: propertyData.price * 0.8,
				lte: propertyData.price * 1.2,
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
		take: 6,
	});

	return (
		<PropertyDetailsClient
			propertyData={propertyData}
			relatedProperties={relatedProperties}
		/>
	);
}
