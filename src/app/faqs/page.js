import Script from "next/script";
import Link from "next/link";

import FaqTab from "../components/FaqTab";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollTop from "../components/ScrollTop";

import { data } from "../storage/faqs";

import { getBaseUrl, getSiteName } from "../helper/Utils";

export const metadata = {
	title: `Perguntas Frequentes | ${getSiteName()}`,
	description:
		"Encontre respostas para as dúvidas mais comuns sobre imóveis, processo de compra, financiamento e nossos serviços de consultoria imobiliária.",
	keywords: [
		"perguntas frequentes imóveis",
		"dúvidas imobiliárias",
		"FAQ imobiliária",
		"ajuda compra imóvel",
	],
	alternates: {
		canonical: `${getBaseUrl()}/perguntas-frequentes`,
	},
	openGraph: {
		title: `Perguntas Frequentes | ${getSiteName()}`,
		description:
			"Encontre respostas para as principais dúvidas sobre imóveis e nossos serviços.",
		url: `${getBaseUrl()}/perguntas-frequentes`,
		type: "website",
		images: [
			{
				url: `${getBaseUrl()}/images/bg/faqs.webp`,
				width: 1200,
				height: 630,
				alt: "Centro de Ajuda InvistaAI",
			},
		],
	},
};

export default function Faqs() {
	const faqsSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: data.flatMap((section) =>
			section.contents.map((item) => ({
				"@type": "Question",
				name: item.title,
				acceptedAnswer: {
					"@type": "Answer",
					text: item.content
						.filter((block) => block.type === "text")
						.map((block) => block.value)
						.join(" "),
				},
			}))
		),
		publisher: {
			"@type": "Organization",
			name: getSiteName(),
			logo: {
				"@type": "ImageObject",
				url: `${getBaseUrl()}/logo.png`,
			},
		},
	};

	return (
		<>
			<Script
				id="faq-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqsSchema) }}
			/>

			<Navbar
				navClass="defaultscroll sticky"
				logolight={true}
				menuClass="navigation-menu nav-left nav-light"
			/>

			<section
				className="bg-half-170 d-table w-100"
				style={{ backgroundImage: "url('/images/bg/faqs.webp')" }}
			>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<p className="text-white-50 para-desc mx-auto mb-0">
									Central de Ajuda
								</p>
								<h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
									Perguntas Frequentes
								</h5>
							</div>
						</div>
					</div>
					<div className="position-middle-bottom">
						<nav aria-label="breadcrumb" className="d-block">
							<ul
								className="breadcrumb breadcrumb-muted mb-0 p-0"
								itemScope
								itemType="https://schema.org/BreadcrumbList"
							>
								<li
									className="breadcrumb-item"
									itemProp="itemListElement"
									itemScope
									itemType="https://schema.org/ListItem"
								>
									<Link href="/" itemProp="item">
										<span itemProp="name">Início</span>
									</Link>

									<meta itemProp="position" content="1" />
								</li>
								<li
									className="breadcrumb-item active"
									aria-current="page"
									itemProp="itemListElement"
									itemScope
									itemType="https://schema.org/ListItem"
								>
									<span itemProp="name">Perguntas Frequentes</span>
									<meta itemProp="position" content="2" />
									<meta
										itemProp="item"
										content={`${getBaseUrl()}/perguntas-frequentes`}
									/>
								</li>
							</ul>
						</nav>
					</div>
				</div>
			</section>
			<div className="position-relative">
				<div className="shape overflow-hidden text-white">
					<svg
						viewBox="0 0 2880 48"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
							fill="currentColor"
						></path>
					</svg>
				</div>
			</div>
			<section className="section">
				<div className="container">
					<FaqTab />
				</div>
			</section>
			<Footer />
			<ScrollTop />
		</>
	);
}
