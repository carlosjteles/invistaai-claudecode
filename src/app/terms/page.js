import Link from "next/link";
import Script from "next/script";

import { FiArrowRight } from "../assets/icons/vander";

import Accordion from "../components/Accordian";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollTop from "../components/ScrollTop";

import { getBaseUrl, getSiteName } from "../helper/utils";

export const metadata = {
	title: `Termos e Condições | ${getSiteName()}`,
	description:
		"Conheça os termos e condições de uso da nossa plataforma imobiliária. Regras e diretrizes para uso responsável dos nossos serviços.",
	keywords: [
		"termos de uso",
		"condições",
		"acordo de usuário",
		"regras",
		"restrições",
	],
	alternates: {
		canonical: `${getBaseUrl()}/termos-e-condicoes`,
	},
	openGraph: {
		title: `Termos e Condições | ${getSiteName()}`,
		description:
			"Conheça os termos e condições de uso da nossa plataforma imobiliária.",
		url: `${getBaseUrl()}/termos-e-condicoes`,
		type: "website",
		siteName: getSiteName(),
	},
	twitter: {
		card: "summary",
		title: `Termos e Condições | ${getSiteName()}`,
		description:
			"Conheça os termos e condições de uso da nossa plataforma imobiliária.",
	},
};

export default function Terms() {
	const termsJsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Termos e Condições",
		description: "Termos e condições de uso da plataforma imobiliária",
		datePublished: "2025-09-01",
		dateModified: "2025-09-01",
		url: `${getBaseUrl()}/termos-e-condicoes`,
		isPartOf: {
			"@type": "WebSite",
			name: getSiteName(),
			url: getBaseUrl(),
		},
		mainEntity: {
			"@type": "Article",
			headline: "Termos e Condições",
			description: "Regras e diretrizes para uso da plataforma",
			datePublished: "2025-09-01",
			author: {
				"@type": "Organization",
				name: getSiteName(),
			},
			publisher: {
				"@type": "Organization",
				name: getSiteName(),
				logo: {
					"@type": "ImageObject",
					url: `${getBaseUrl()}/images/logo-dark.png`,
				},
			},
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Início",
					item: getBaseUrl(),
				},
				{
					"@type": "ListItem",
					position: 2,
					name: "Termos e Condições",
					item: `${getBaseUrl()}/termos-e-condicoes`,
				},
			],
		},
		speakable: {
			"@type": "SpeakableSpecification",
			cssSelector: [".card-title", ".text-muted"],
		},
	};

	return (
		<>
			<Script
				id="terms-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(termsJsonLd) }}
			/>

			<Navbar
				navClass="defaultscroll sticky"
				logolight={true}
				menuClass="navigation-menu nav-center nav-light"
			/>

			<section
				className="bg-half-170 d-table w-100"
				style={{
					backgroundImage: "url('/images/bg/terms.webp')",
					backgroundPosition: "bottom",
				}}
			>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
									Termos e condições
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
									<span itemProp="name">Termos e condições</span>
									<meta itemProp="position" content="2" />
									<meta
										itemProp="item"
										content={`${getBaseUrl()}/termos-e-condicoes`}
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
					<div className="row justify-content-center">
						<div className="col-lg-9">
							<article
								className="card shadow border-0 rounded-3"
								itemScope
								itemType="https://schema.org/Article"
							>
								<div className="card-body" itemProp="articleBody">
									<meta itemProp="headline" content="Termos e Condições" />
									<meta itemProp="datePublished" content="2025-09-01" />
									<meta itemProp="dateModified" content="2025-09-01" />
									<meta itemProp="author" content={getSiteName()} />

									<h5 className="card-title" itemProp="name">
										Introdução :
									</h5>
									<p className="text-muted">
										Estes Termos e Condições regulam o uso deste site e de todos
										os serviços nele oferecidos. Ao acessar nossa plataforma,
										você concorda integralmente com as regras aqui descritas.
										Caso não concorde, recomendamos não utilizar nossos
										serviços.
									</p>

									<h5 className="card-title mb-0">Acordo com o Usuário :</h5>
									<p className="text-muted mb-2">
										O acesso e uso deste site são permitidos apenas para fins
										legítimos. Ao utilizá-lo, o usuário compromete-se a:
									</p>
									<ul className="list-unstyled text-muted mb-2">
										<li className="ms-0 mt-2">
											<FiArrowRight className="fea icon-sm me-2" />
											Fornecer informações verdadeiras e atualizadas.
										</li>
										<li className="ms-0 mt-2">
											<FiArrowRight className="fea icon-sm me-2" />
											Respeitar as leis e regulamentos aplicáveis.
										</li>
										<li className="ms-0 mt-2">
											<FiArrowRight className="fea icon-sm me-2" />
											Não utilizar o site para fins fraudulentos, difamatórios
											ou ilícitos.
										</li>
										<li className="ms-0 mt-2">
											<FiArrowRight className="fea icon-sm me-2" />
											Não copiar, distribuir ou modificar conteúdos sem
											autorização prévia.
										</li>
									</ul>

									<p className="text-muted">
										A propriedade intelectual de todos os textos, imagens,
										logotipos e outros elementos pertence exclusivamente à
										empresa, sendo vedado seu uso indevido. <br />A empresa não
										garante disponibilidade contínua do site e se exime de
										responsabilidades por problemas técnicos, falhas de conexão
										ou danos causados por softwares maliciosos.
									</p>

									<h5 className="card-title">Restrições :</h5>
									<p className="text-muted">
										Você está especificamente proibido de:
									</p>
									<ul className="list-unstyled text-muted">
										<li className="ms-0 mt-2">
											<FiArrowRight className="fea icon-sm me-2" />
											Utilizar o site para qualquer atividade ilegal.
										</li>
										<li className="ms-0 mt-2">
											<FiArrowRight className="fea icon-sm me-2" />
											Reproduzir, duplicar ou vender conteúdo sem permissão.
										</li>
										<li className="ms-0 mt-2">
											<FiArrowRight className="fea icon-sm me-2" />
											Violar direitos autorais ou marcas registradas.
										</li>
										<li className="ms-0 mt-2">
											<FiArrowRight className="fea icon-sm me-2" />
											Manipular informações de outros usuários.
										</li>
									</ul>

									<h5 className="card-title">Perguntas Frequentes :</h5>

									<div itemScope itemType="https://schema.org/FAQPage">
										<Accordion />
									</div>
								</div>
							</article>
						</div>
					</div>
				</div>
			</section>
			<Footer />
			<ScrollTop />
		</>
	);
}
