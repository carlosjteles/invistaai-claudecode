import { League_Spartan } from "next/font/google";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.css";
import "../app/assets/scss/style.scss";
import "../app/assets/css/materialdesignicons.min.css";

import GoogleAnalyticsClient from "./components/GoogleAnalyticsClient";

import { Providers } from "./providers";

import { getBaseUrl, getSiteName } from "./helper/utils";

import { contact } from "./storage/about";

const league = League_Spartan({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "900"],
	display: "swap",
	variable: "--font-league",
	preload: true,
	fallback: ["Arial", "sans-serif"],
});

export const metadata = {
	metadataBase: new URL(getBaseUrl()),
	title: getSiteName(),
	description:
		"Encontre apartamentos, studios e imóveis em São Paulo com potencial de valorização. Curadoria especializada e suporte completo para investidores e compradores.",
	keywords: [
		"imóveis em São Paulo",
		"comprar apartamento",
		"studio SP",
		"investimento imobiliário",
		"primeiro imóvel",
	],
	authors: [{ name: `${getSiteName()}` }],
	openGraph: {
		title: `${getSiteName()} | Investimento Imobiliário Reimaginado`,
		description:
			"Conectamos investidores e compradores ao imóvel ideal em São Paulo, com curadoria, suporte consultivo e oportunidades de valorização.",
		url: `${getBaseUrl()}`,
		siteName: `${getSiteName()}`,
		images: [
			{
				url: `${getBaseUrl()}/images/og-image.jpg`,
				width: 1200,
				height: 630,
				alt: `Imóveis em São Paulo - ${getSiteName()}`,
			},
		],
		locale: "pt_BR",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: `@${getSiteName().toLocaleLowerCase()}`,
		title: `${getSiteName().toLocaleLowerCase()} | Investimento Imobiliário Reimaginado`,
		description:
			"Do primeiro imóvel ao investimento em alto padrão. Conectamos você às melhores oportunidades imobiliárias em São Paulo.",
		images: [`${getBaseUrl()}/images/og-image.jpg`],
	},
	robots: {
		index: true,
		follow: true,
	},
	alternates: {
		canonical: `${getBaseUrl()}`,
	},
	icons: {
		icon: "/images/favicon.ico",
		shortcut: "/images/favicon-16x16.png",
		apple: "/images/apple-touch-icon.png",
		other: {
			rel: "icon",
			url: "/images/favicon-32x32.png",
			type: "image/png",
			sizes: "32x32",
		},
	},
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#09acf4",
};

export const jsonLd = {
	"@context": "https://schema.org",
	"@type": "RealEstateAgent",
	"@id": `${getBaseUrl()}#organization`,
	name: getSiteName(),
	url: getBaseUrl(),
	logo: `${getBaseUrl()}/images/logo-dark.svg`,
	image: `${getBaseUrl()}/images/og-image.jpg`,
	description:
		"Encontre apartamentos, studios e imóveis em São Paulo com potencial de valorização. Curadoria especializada e suporte completo para investidores e compradores.",
	address: {
		"@type": "PostalAddress",
		addressLocality: contact.address.city,
		addressRegion: contact.address.state,
		postalCode: contact.address.zip,
		streetAddress: contact.address.complement
			? `${contact.address.street}, ${contact.address.complement}`
			: contact.address.street,
		addressCountry: "BR",
	},
	geo: {
		"@type": "GeoCoordinates",
		latitude: -23.611426182116418,
		longitude: -46.69457299672947,
	},
	hasMap: contact.map,
	telephone: `+${contact.phone}`,
	email: contact.email,
	openingHours: "Mo,Tu,We,Th,Fr 09:00-18:00",
	priceRange: "R$",
	sameAs: Object.values(contact.social || {}).filter(Boolean),
	knowsAbout: [
		"Investimento Imobiliário",
		"Mercado Imobiliário São Paulo",
		"Studios",
		"Apartamentos",
	],
	areaServed: {
		"@type": "City",
		name: contact.address.city,
	},
	makesOffer: {
		"@type": "Offer",
		itemOffered: {
			"@type": "Service",
			name: "Consultoria Imobiliária",
			description:
				"Assessoria completa para encontrar, avaliar e adquirir imóveis em São Paulo",
		},
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="pt-BR">
			<head>
				<Script
					src={`https://www.googletagmanager.com/gtag/js?id=${
						process.env.NEXT_PUBLIC_GA_ID || "G-4BELWMGKF8"
					}`}
					strategy="afterInteractive"
				/>
				<Script id="gtag-init" strategy="afterInteractive">
					{`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${
													process.env.NEXT_PUBLIC_GA_ID || "G-4BELWMGKF8"
												}');
                    `}
				</Script>

				<script
					id="schema-org"
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
					}}
				/>
			</head>
			<body className={league.variable}>
				<Providers>
					<GoogleAnalyticsClient />
					{children}
				</Providers>
			</body>
		</html>
	);
}
