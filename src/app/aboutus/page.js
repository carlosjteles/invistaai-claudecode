import React from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import Navbar from "../components/Navbar";
import About from "../components/About";
import Blog from "../components/Blog";
import GetInTouch from "../components/GetInTouch";
import Footer from "../components/Footer";
import ScrollTop from "../components/ScrollTop";
import AboutCounter from "../components/counter/AboutCounter";
import Broker from "../components/Broker";

import { FiArrowRight } from "react-icons/fi";

import { contact } from "../storage/about";

import { getBaseUrl, getSiteName } from "../helper/utils";

export const metadata = {
	title: `Sobre a ${getSiteName()} | Especialistas em Investimento Imobiliário`,
	description:
		"Conectamos pessoas e capital a oportunidades imobiliárias em São Paulo. Conheça nossa história e como ajudamos investidores a encontrar imóveis com alto potencial de valorização.",
	keywords: [
		"sobre InvistaAI",
		"investimento imobiliário",
		"imóveis São Paulo",
		"consultoria imobiliária",
		"casa própria",
	],
	alternates: {
		canonical: `${getBaseUrl()}/sobre`,
	},
	openGraph: {
		title: `Sobre a ${getSiteName()} | Especialistas em Investimento Imobiliário`,
		description:
			"Conectamos pessoas e capital a oportunidades imobiliárias em São Paulo com curadoria rigorosa e dados de mercado.",
		url: `${getBaseUrl()}/sobre`,
		type: "website",
		images: [
			{
				url: `${getBaseUrl()}/images/bg/aboutus.webp`,
				width: 1200,
				height: 630,
				alt: `Sobre a ${getSiteName()}`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: `Sobre a ${getSiteName()}`,
		description:
			"Especialistas em conectar pessoas às melhores oportunidades imobiliárias em São Paulo.",
		images: [`${getBaseUrl()}/images/bg/aboutus.webp`],
	},
};

export default function AboutUs() {
	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `Sobre a ${getSiteName()}`,
		description:
			"Conectamos pessoas e capital a oportunidades imobiliárias em São Paulo com curadoria rigorosa.",
		url: `${getBaseUrl()}/sobre`,
		mainEntity: {
			"@type": "RealEstateAgent",
			name: getSiteName(),
			description: "Especialistas em investimento imobiliário em São Paulo.",
			url: getBaseUrl(),
			logo: `${getBaseUrl()}/images/logo-dark.svg`,
			telephone: `+${contact.phone}`,
			email: contact.email,
			foundingDate: "2021",
			numberOfEmployees: {
				"@type": "QuantitativeValue",
				value: "2+",
			},
			areaServed: {
				"@type": "GeoCircle",
				geoMidpoint: {
					"@type": "GeoCoordinates",
					latitude: -23.611426182116418,
					longitude: -46.69457299672947,
				},
				geoRadius: "50 km",
				name: "São Paulo e região metropolitana",
			},
			slogan: "Eficiência. Transparência. Controle. Invista com inteligência.",
			address: {
				"@type": "PostalAddress",
				streetAddress: contact.address.street,
				addressLocality: contact.address.city,
				addressRegion: contact.address.state,
				postalCode: contact.address.zip,
				addressCountry: "BR",
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
					name: "Sobre Nós",
					item: `${getBaseUrl()}/sobre`,
				},
			],
		},
	};

	return (
		<>
			<Script
				id="about-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
			/>

			<Navbar
				navClass="defaultscroll sticky"
				logolight={true}
				menuClass="navigation-menu nav-center nav-light"
			/>
			<section
				className="bg-half-170 d-table w-100"
				style={{ backgroundImage: "url('/images/bg/aboutus.webp')" }}
			>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<p className="text-white-50 para-desc mx-auto mb-0">
									Nossa história: {getSiteName()}
								</p>
								<h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
									Sobre nós
								</h5>
							</div>
						</div>
					</div>
					{/* Adicionar após o div.container na section principal */}
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
									<span itemProp="name">Sobre Nós</span>
									<meta itemProp="position" content="2" />
									<meta itemProp="item" content={`${getBaseUrl()}/sobre`} />
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
					<div className="row align-items-center">
						<div className="col-lg-6 col-md-6">
							<div className="about-left">
								<div className="position-relative shadow p-2 rounded-top-pill rounded-5 bg-white img-one">
									<Image
										src="/images/about-01.webp"
										width={0}
										height={0}
										sizes="100vw"
										style={{ width: "100%", height: "auto" }}
										className="img-fluid rounded-top-pill rounded-5"
										alt={`Prédio ${getSiteName()}`}
									/>
									<div className="position-absolute top-0 start-0 z-n1">
										<Image
											src="/images/svg/dots.svg"
											width={0}
											height={0}
											sizes="100vw"
											style={{ width: "100%", height: "auto" }}
											className="avatar avatar-xl-large"
											alt="Padrão de fundo com bolinhas"
										/>
									</div>
								</div>

								<div className="img-two shadow rounded-3 overflow-hidden p-2 mb-2 bg-white">
									<Image
										src="/images/plate.webp"
										width={0}
										height={0}
										sizes="100vw"
										style={{ width: "100%", height: "auto" }}
										className="img-fluid rounded-3"
										alt="Placa Prédio"
									/>
								</div>

								<span className="badge bg-info mt-4">
									Eficiência. Transparência. Controle. Invista com inteligência.
								</span>
							</div>
						</div>

						<div
							className="col-lg-6 col-md-6 mt-4 mt-sm-0 pt-2 pt-sm-0"
							itemScope
							itemType="https://schema.org/RealEstateAgent"
						>
							<meta itemProp="name" content={getSiteName()} />
							<meta itemProp="url" content={getBaseUrl()} />
							<meta
								itemProp="logo"
								content={`${getBaseUrl()}/images/logo-dark.svg`}
							/>

							<div className="section-title ms-lg-5">
								<h6 className="text-primary fw-medium mb-2" itemProp="slogan">
									{getSiteName()}
								</h6>
								<h4 className="title mb-3" itemProp="alternateName">
									É investimento imobiliário reimaginado
								</h4>
								<p className="text-muted para-desc mb-3" itemProp="description">
									Conectamos pessoas e capital a{" "}
									<strong>oportunidades imobiliárias</strong> em São Paulo — do{" "}
									<strong>primeiro imóvel / casa própria</strong> a ativos de{" "}
									<strong>alto padrão</strong> com excelente potencial de
									valorização. Unimos dados de mercado, tecnologia e uma rede de
									parceiros para entregar <strong>curadoria rigorosa</strong>,
									comparativos claros e acompanhamento consultivo do início ao
									fim.
								</p>
								<ul
									className="list-unstyled text-muted mb-2"
									itemProp="makesOffer"
									itemScope
									itemType="https://schema.org/Offer"
								>
									<meta itemProp="category" content="Serviços Imobiliários" />

									<li className="ms-0 mt-2">
										<FiArrowRight className="fea icon-sm me-2 ms-0" />
										<span itemProp="description">
											Curadoria de empreendimentos com potencial de valorização
										</span>
									</li>
									<li className="ms-0 mt-2">
										<FiArrowRight className="fea icon-sm me-2 ms-0" />
										<span itemProp="description">
											Atendimento consultivo para investidor e comprador do
											primeiro imóvel
										</span>
									</li>
									<li className="ms-0 mt-2">
										<FiArrowRight className="fea icon-sm me-2 ms-0" />
										<span itemProp="description">
											Suporte completo: estudo financeiro, crédito e
											documentação
										</span>
									</li>
								</ul>

								<div className="mt-4">
									<Link
										href={`https://wa.me/${contact.phone}`}
										target="_blank"
										rel="noopener noreferrer"
										className="btn btn-pills btn-primary"
										itemProp="contactPoint"
										itemScope
										itemType="https://schema.org/ContactPoint"
									>
										<meta itemProp="contactType" content="customer service" />
										<meta itemProp="telephone" content={`+${contact.phone}`} />
										Fale com um consultor{" "}
										<i className="mdi mdi-arrow-right align-middle"></i>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="container mt-100 mt-60">
					<About />
				</div>

				<div className="container-fluid bg-building-pic mt-100 mt-60">
					<div
						className=" opacity-25 position-absolute w-100 h-100 top-0 start-0"
						style={{
							backgroundImage: "url('/images/map.png')",
							backgroundPosition: "center",
						}}
					></div>
					<div className="container">
						<div className="row justify-content-center">
							<div className="col">
								<div className="section-title text-center mb-4 pb-2">
									<h4 className="title mb-3">
										Confiança construída com resultados reais
									</h4>
									<p className="text-muted para-desc mb-0 mx-auto">
										Acompanhamos investidores e compradores do primeiro imóvel
										com transparência em cada etapa.
									</p>
								</div>
							</div>
						</div>

						<AboutCounter />
					</div>
				</div>

				<div
					className="container mt-100 mt-60"
					itemScope
					itemType="https://schema.org/Organization"
				>
					<meta itemProp="subOrganization" content="Equipe de Corretores" />

					<Broker />
				</div>

				<div
					className="container mt-100 mt-60"
					itemScope
					itemType="https://schema.org/Blog"
				>
					<Blog />
				</div>

				<div className="container mt-100 mt-60">
					<GetInTouch />
				</div>
			</section>
			<Footer />
			<ScrollTop />
		</>
	);
}
