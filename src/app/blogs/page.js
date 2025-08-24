import BlogsClient from "./BlogsClient";

import { getBaseUrl, getSiteName } from "../helper/Utils";

export const metadata = {
	title: `Blog e Notícias sobre Imóveis em São Paulo | ${getSiteName()}`,
	description:
		"Conteúdo especializado sobre mercado imobiliário, dicas para investidores e tendências para quem quer comprar imóvel em São Paulo.",
	keywords: [
		"blog imobiliário",
		"notícias imóveis",
		"mercado imobiliário São Paulo",
		"dicas compra de imóvel",
		"investimento imobiliário",
	],
	openGraph: {
		title: `Blog Imobiliário | ${getSiteName()}`,
		description:
			"Conteúdo especializado sobre mercado imobiliário e dicas para investidores.",
		url: `${getBaseUrl()}/blogs`,
		type: "website",
		images: [
			{
				url: `${getBaseUrl()}/images/bg/blogs.webp`,
				width: 1200,
				height: 630,
				alt: "Blog Imobiliário",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: `Blog Imobiliário | ${getSiteName()}`,
		description:
			"Conteúdo especializado sobre mercado imobiliário e dicas para investidores.",
		images: [`${getBaseUrl()}/images/bg/blogs.webp`],
	},
	alternates: {
		canonical: `${getBaseUrl()}/blogs`,
	},
	robots: {
		index: true,
		follow: true,
		nocache: false,
		"max-image-preview": "large",
		"max-snippet": -1,
	},
};

export default function Blogs() {
	return <BlogsClient />;
}
