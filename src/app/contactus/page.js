import ContactClient from "./ContactClient";

import { getBaseUrl, getSiteName } from "../helper/utils";

export const metadata = {
	title: `Entre em Contato | ${getSiteName()}`,
	description:
		"Fale com nossa equipe especializada para encontrar seu imóvel ideal em São Paulo. Atendimento personalizado via WhatsApp, email ou telefone.",
	keywords: [
		"contato imobiliária",
		"atendimento imobiliário",
		"fale conosco",
		"agendar visita",
		"consultor imobiliário",
	],
	alternates: {
		canonical: `${getBaseUrl()}/contato`,
	},
	openGraph: {
		title: `Entre em Contato | ${getSiteName()}`,
		description:
			"Fale com nossa equipe especializada para encontrar seu imóvel ideal em São Paulo.",
		url: `${getBaseUrl()}/contato`,
		type: "website",
		images: [
			{
				url: `${getBaseUrl()}/images/bg/contactus.webp`,
				width: 1200,
				height: 630,
				alt: `Contato ${getSiteName()}`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: `Entre em Contato | ${getSiteName()}`,
		description:
			"Fale com nossa equipe especializada para encontrar seu imóvel ideal em São Paulo.",
	},
};

export default function ContactPage() {
	return <ContactClient />;
}
