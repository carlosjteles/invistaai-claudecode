import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

import Categories from "./components/Categories";
import Customers from "./components/Customers";
import FeaturedProperties from "./components/FeaturedProperties";
import Footer from "./components/Footer";
import GetInTouch from "./components/GetInTouch";
import HomeFilter from "./components/HomeFilter";
import Navbar from "./components/Navbar";
import ScrollTop from "./components/ScrollTop";
import TextAnimation from "./components/TextAnimation";

import { getBaseUrl, getSiteName } from "./helper/utils";

export const revalidate = 300;

export default function Home() {
	const homeJsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		publisher: {
			"@type": "RealEstateAgent",
			name: getSiteName(),
		},
		name: "Página Inicial",
		description:
			"Uma plataforma inteligente para quem quer comprar imóveis com agilidade, confiança e sem taxas abusivas.",
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

	return (
		<>
			<Script
				id="homepage-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
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
							alt={`Invista em imóveis em São Paulo com ${getSiteName()} - Curadoria especializada`}
							fill
							priority
							fetchPriority="high"
							quality={100}
							sizes="100vw"
							id="hero-images"
							className="bg-overlay image-wrap"
							style={{
								objectFit: "cover",
								objectPosition: "center",
							}}
						/>
						<div className="bg-overlay bg-black opacity-50"></div>

						<div className="container">
							<div className="row justify-content-center">
								<div className="col-12">
									<div className="title-heading">
										<TextAnimation />
										<p className="para-desc text-white title-dark mb-0">
											Uma plataforma inteligente para quem quer comprar imóveis
											com agilidade, confiança e sem taxas abusivas.
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
								<h4 className="title mb-3">
									Investimento imobiliário com foco em valorização
								</h4>
								<p className="text-muted para-desc mb-0">
									Nossa plataforma une dados de mercado, tecnologia e curadoria
									criteriosa para entregar comparativos claros e análises
									fundamentadas. Isso garante decisões de investimento seguras e
									alinhadas ao seu perfil, seja para diversificação de carteira
									ou conquista da casa própria.
								</p>

								<p className="text-muted para-desc mb-0">
									Mais do que uma plataforma, oferecemos acompanhamento
									consultivo em todas as etapas: do estudo financeiro ao crédito
									e documentação. Transparência e resultados reais são a base da
									confiança que construímos com cada investidor.
								</p>

								<div className="mt-4">
									<Link href="/sobre" className="btn btn-pills btn-primary">
										Saiba Mais{" "}
										<i className="mdi mdi-arrow-right align-middle"></i>
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
					<Customers />
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
