import Link from "next/link";
import Image from "next/image";

import Categories from "./components/Categories";
import FeaturedProperties from "./components/FeaturedProperties";
import Footer from "./components/Footer";
import GetInTouch from "./components/GetInTouch";
import HomeFilter from "./components/HomeFilter";
import Navbar from "./components/Navbar";
import ScrollTop from "./components/ScrollTop";
import TextAnimation from "./components/TextAnimation";

import { getBaseUrl, getSiteName } from "./helper/utils";

import { contact } from "./storage/about";
import Mdi from "./components/Mdi";

export const revalidate = 300;

export const metadata = {
	title: `Apartamentos de alto padrão em São Paulo | ${getSiteName()}`,
	description:
		"Lançamentos, obras e imóveis prontos de alto padrão em São Paulo, com preço, plantas e entrega atualizados toda semana. Compare projetos e veja o preço do m² por bairro.",
	alternates: { canonical: getBaseUrl() },
};

export default function Home() {
	const homeJsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		publisher: {
			"@type": "RealEstateAgent",
			name: getSiteName(),
			address: {
				"@type": "PostalAddress",
				streetAddress: contact.address.street,
				addressLocality: contact.address.city,
				addressRegion: contact.address.state,
				postalCode: contact.address.zip,
				addressCountry: "BR",
			},
			telephone: `+${contact.phone}`,
			url: getBaseUrl(),
		},
		name: "Página Inicial",
		description:
			"Apartamentos de alto padrão em São Paulo: lançamentos, obras e prontos selecionados, com preço, plantas e entrega atualizados toda semana.",
		url: getBaseUrl(),
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Home",
					item: getBaseUrl(),
				},
			],
		},
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${getBaseUrl()}/imoveis?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
		datePublished: "2025-09-01",
		dateModified: new Date().toISOString().split("T")[0],
		primaryImageOfPage: {
			"@type": "ImageObject",
			url: `${getBaseUrl()}/images/bg/home.webp`,
		},
		speakable: {
			"@type": "SpeakableSpecification",
			cssSelector: [".title-heading", ".para-desc"],
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": getBaseUrl(),
		},
		hasPart: [
			{
				"@type": "WebPageElement",
				isPartOf: {
					"@id": getBaseUrl(),
				},
				name: "Categorias de Imóveis",
				position: 1,
			},
			{
				"@type": "WebPageElement",
				isPartOf: {
					"@id": getBaseUrl(),
				},
				name: "Imóveis em destaque",
				position: 2,
			},
			{
				"@type": "WebPageElement",
				isPartOf: {
					"@id": getBaseUrl(),
				},
				name: "O que nossos clientes dizem",
				position: 3,
			},
		],
	};

	const sameAs = Object.values(contact.social || {}).filter(Boolean);

	const organizationJsonLd = {
		"@context": "https://schema.org",
		"@type": "RealEstateAgent",
		"@id": `${getBaseUrl()}#organization`,
		name: getSiteName(),
		url: getBaseUrl(),
		telephone: `+${contact.phone}`,
		logo: `${getBaseUrl()}/images/icon.svg`,
		image: `${getBaseUrl()}/images/icon.svg`,
		address: {
			"@type": "PostalAddress",
			streetAddress: contact.address.street,
			addressLocality: contact.address.city,
			addressRegion: contact.address.state,
			postalCode: contact.address.zip,
			addressCountry: "BR",
		},
		sameAs,
	};

	return (
		<>
			<script
				id="homepage-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(homeJsonLd).replace(/</g, "\\u003c"),
				}}
			/>
			<script
				id="organization-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
				}}
			/>

			<Navbar
				navClass="defaultscroll sticky"
				menuClass="navigation-menu nav-center"
			/>
			<section className="position-relative mt-5 pt-4">
				<div className="container-fluid px-md-4 px-2 mt-2 overflow-hidden">
					<div
						className="bg-home-one d-table w-100 shadow rounded-3 overflow-hidden"
						id="home"
					>
						<Image
							src="/images/bg/home.webp"
							alt={`Lobby de empreendimento de alto padrão em São Paulo - ${getSiteName()}`}
							fill
							priority
							fetchPriority="high"
							quality={75}
							sizes="100vw"
							id="hero-images"
							className="bg-overlay"
							style={{
								objectFit: "cover",
								objectPosition: "center",
							}}
						/>
						<div className="bg-overlay bg-black opacity-50"></div>

						<div className="container position-relative" style={{ zIndex: 1 }}>
							<div className="row justify-content-center">
								<div className="col-12">
									<div className="title-heading">
										<TextAnimation />
										<p className="para-desc text-white title-dark mb-0">
											Lançamentos, obras e imóveis prontos selecionados pela
											nossa equipe, com preço, plantas e prazo de entrega
											atualizados toda semana.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="section pt-5">
				<div className="container">
					<HomeFilter />
				</div>

				<div className="container mt-100 mt-60">
					<div className="row align-items-center">
						<div className="col-lg-6 col-md-6">
							<div className="row g-3 align-items-center">
								<div className="col-lg-7 col-6">
									<Image
										src="/images/home-about-01.webp"
										width={0}
										height={0}
										sizes="100vw"
										style={{ width: "100%", height: "auto" }}
										className="img-fluid rounded-3"
										alt={getSiteName().toLocaleLowerCase()}
										title={getSiteName()}
									/>
								</div>

								<div className="col-lg-5 col-6">
									<div className="row g-3">
										<div className="col-lg-12 col-md-12">
											<Image
												src="/images/home-about-02.webp"
												width={0}
												height={0}
												sizes="100vw"
												style={{ width: "100%", height: "auto" }}
												className="img-fluid rounded-3"
												alt={getSiteName().toLocaleLowerCase()}
												title={getSiteName()}
											/>
										</div>

										<div className="col-lg-12 col-md-12">
											<Image
												src="/images/icon.svg"
												width={100}
												height={100}
												className="img-fluid"
												alt={getSiteName().toLocaleLowerCase()}
												title={getSiteName()}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="col-lg-6 col-md-6 mt-4 mt-sm-0 pt-2 pt-sm-0">
							<div className="section-title ms-lg-5">
								<p className="h6 text-primary fw-medium mb-2 mt-0 mx-0">
									Por que escolher a {getSiteName()}
								</p>
								<h2 className="title h4 mb-3">
									Investimento imobiliário humanizado
								</h2>
								<p className="text-muted para-desc mb-3">
									Selecionamos lançamentos e imóveis prontos de alto padrão das
									principais incorporadoras de São Paulo e mantemos preço,
									plantas e prazo de entrega sempre atualizados. Com o{" "}
									<Link href="/indice-preco-m2" className="text-primary text-decoration-underline">
										Índice de preço do m²
									</Link>{" "}
									e o{" "}
									<Link href="/comparar" className="text-primary text-decoration-underline">
										comparador de imóveis
									</Link>
									, você vê quanto vale cada bairro e cada projeto antes de
									decidir.
								</p>

								<p className="text-muted para-desc mb-0">
									E você não decide sozinho: um corretor acompanha cada etapa,
									da visita ao decorado à negociação, à simulação de crédito e à
									documentação. Para morar ou para investir, a escolha é sua,
									com todas as informações na mesa.
								</p>

								<div className="mt-4">
									<Link href="/sobre" className="btn btn-pills btn-primary">
										Saiba Mais{" "}
										<Mdi n="arrow-right" className="align-middle" />
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="container mt-100 mt-60">
					<Categories />
				</div>

				<div className="container mt-100 mt-60">
					<FeaturedProperties />
				</div>

				<div className="container mt-100 mt-60">
					<GetInTouch />
				</div>
			</section>
			<Footer showImage={true} />
			<ScrollTop />
		</>
	);
}
