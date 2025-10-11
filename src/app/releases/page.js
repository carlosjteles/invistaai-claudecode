import Properties from "../properties/page";

import { getBaseUrl, getSiteName } from "../helper/utils";

export const revalidate = 300;

export const metadata = {
	title: `Lançamentos Imobiliários | ${getSiteName()}`,
	description:
		"Descubra os mais recentes lançamentos imobiliários em São Paulo com condições especiais de pré-lançamento. Empreendimentos exclusivos e oportunidades únicas de investimento.",
	keywords: [
		"lançamentos imobiliários",
		"pré-lançamento",
		"novos empreendimentos",
		"apartamentos na planta",
		"investimento imobiliário",
		"São Paulo",
	],
	alternates: {
		canonical: `${getBaseUrl()}/lancamentos`,
	},
	openGraph: {
		title: `Lançamentos Imobiliários | ${getSiteName()}`,
		description:
			"Descubra os mais recentes lançamentos imobiliários em São Paulo com condições especiais de pré-lançamento.",
		url: `${getBaseUrl()}/lancamentos`,
		type: "website",
		images: [
			{
				url: `${getBaseUrl()}/images/bg/properties.webp`,
				width: 1200,
				height: 630,
				alt: "Lançamentos imobiliários em São Paulo",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: `@${getSiteName().toLowerCase()}`,
		title: `Lançamentos Imobiliários | ${getSiteName()}`,
		description:
			"Descubra os mais recentes lançamentos imobiliários em São Paulo com condições especiais.",
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

export default async function Releases(props) {
	props.params = { ...props.params, pathname: "lancamentos" };

	return Properties(props);
}
