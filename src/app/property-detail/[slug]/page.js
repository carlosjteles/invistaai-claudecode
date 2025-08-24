import PropertyDetailsClient from "./PropertyDetailsClient";

import { categories } from "../../storage/filters";

import { propertyData as data } from "../../storage/data";

import { getBaseUrl, getSiteName } from "../../helper/Utils";

export async function generateMetadata({ params }) {
	const propertyData = data.find((item) => item.slug === params.slug);

	if (!propertyData) {
		return {
			title: `Imóvel não encontrado | ${getSiteName()}`,
			description: "O imóvel que você está procurando não foi encontrado.",
		};
	}

	const category =
		categories.find((cat) => cat.id === propertyData.category)?.label || "";

	return {
		title:
			propertyData.seo?.title || `${propertyData.address} | ${getSiteName()}`,
		description:
			propertyData.seo?.description ||
			`${propertyData.preview.area} com ${propertyData.preview.bedroom} em ${propertyData.neighborhood}`,
		keywords:
			propertyData.seo?.keywords ||
			`imóvel, ${category}, ${propertyData.neighborhood}`,
		openGraph: {
			title: propertyData.seo?.title || propertyData.address,
			description: propertyData.seo?.description,
			type: "article",
			url: `${getBaseUrl()}/imovel/${propertyData.slug}`,
			images: [
				{
					url: `${getBaseUrl()}${propertyData.image}`,
					width: 1200,
					height: 630,
					alt: propertyData.address,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: propertyData.seo?.title || propertyData.address,
			description: propertyData.seo?.description,
			images: [`${getBaseUrl()}${propertyData.image}`],
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

export default function PropertyDetails(props) {
	return <PropertyDetailsClient {...props} />;
}
