import PropertiesClient from "./PropertiesClient";

import { getBaseUrl, getSiteName } from "../helper/Utils";

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

export default function Properties(props) {
	return <PropertiesClient {...props} />;
}
