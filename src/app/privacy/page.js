import Link from "next/link";
import Script from "next/script";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollTop from "../components/ScrollTop";

import { contact } from "../storage/about";

import { FiArrowRight } from "../assets/icons/vander";

import { getBaseUrl, getSiteName } from "../helper/Utils";

export const metadata = {
	title: `Política de Privacidade | ${getSiteName()}`,
	description:
		"Entenda como coletamos, usamos e protegemos seus dados pessoais em conformidade com a LGPD. Conheça seus direitos como titular de dados.",
	keywords: [
		"política de privacidade",
		"LGPD",
		"proteção de dados",
		"privacidade",
	],
	alternates: {
		canonical: `${getBaseUrl()}/politica-de-privacidade`,
	},
	openGraph: {
		title: `Política de Privacidade | ${getSiteName()}`,
		description:
			"Entenda como coletamos e protegemos seus dados em conformidade com a LGPD.",
		url: `${getBaseUrl()}/politica-de-privacidade`,
		type: "website",
		siteName: getSiteName(),
	},
};

export default function Privacy() {
	const privacyJsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Política de Privacidade",
		description: `Política de Privacidade da ${getSiteName()} em conformidade com a LGPD`,
		datePublished: "2025-09-01",
		dateModified: "2025-09-01",
		url: `${getBaseUrl()}/politica-de-privacidade`,
		isPartOf: {
			"@type": "WebSite",
			name: getSiteName(),
			url: getBaseUrl(),
		},
		mainEntity: {
			"@type": "Article",
			headline: "Política de Privacidade",
			description: "Como coletamos e protegemos seus dados pessoais",
			datePublished: "2025-09-01",
			dateModified: "2025-09-01",
			author: {
				"@type": "Organization",
				name: getSiteName(),
			},
			publisher: {
				"@type": "Organization",
				name: getSiteName(),
				logo: {
					"@type": "ImageObject",
					url: `${getBaseUrl()}/logo.png`,
				},
			},
		},
		speakable: {
			"@type": "SpeakableSpecification",
			cssSelector: [".card-title", ".text-muted"],
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
					name: "Política de Privacidade",
					item: `${getBaseUrl()}/politica-de-privacidade`,
				},
			],
		},
	};

	return (
		<>
			<Script
				id="privacy-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyJsonLd) }}
			/>

			<Navbar
				navClass="defaultscroll sticky"
				logolight={true}
				menuClass="navigation-menu nav-left nav-light"
			/>

			<section
				className="bg-half-170 d-table w-100"
				style={{ backgroundImage: "url('/images/bg/privacy.webp')" }}
			>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
									Política de Privacidade
								</h5>
								<p className="text-white-50 para-desc mx-auto mb-0">
									Última atualização: 12/08/2025
								</p>
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
									<span itemProp="name">Política de Privacidade</span>
									<meta itemProp="position" content="2" />
									<meta
										itemProp="item"
										content={`${getBaseUrl()}/politica-de-privacidade`}
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
							<article itemScope itemType="https://schema.org/WebPage">
								<meta itemProp="lastReviewed" content="2025-09-01" />
								<meta itemProp="specialty" content="Política de Privacidade" />

								<div
									className="card shadow rounded-3 border-0"
									itemScope
									itemType="https://schema.org/Article"
								>
									<meta itemProp="headline" content="Política de Privacidade" />
									<meta itemProp="datePublished" content="2025-09-01" />
									<meta itemProp="dateModified" content="2025-09-01" />

									<div className="card-body" itemProp="articleBody">
										<h5 className="card-title" itemProp="name">
											Visão Geral
										</h5>
										<p className="text-muted">
											Nós, da {getSiteName()}, respeitamos a sua privacidade e
											estamos comprometidos em proteger os seus dados pessoais.
											Esta Política de Privacidade explica como coletamos,
											usamos e protegemos as informações que você nos fornece,
											em conformidade com a Lei Geral de Proteção de Dados
											Pessoais (Lei nº 13.709/2018).
										</p>

										<h5 className="card-title mb-1">
											1. Coleta de Informações
										</h5>
										<p className="text-muted mb-0">
											Podemos coletar as seguintes informações quando você
											interage com nossos serviços:
										</p>
										<ul className="list-unstyled text-muted">
											<li className="mt-2 ms-0">
												<FiArrowRight className="fea icon-sm me-2" />
												Dados de identificação: nome, e-mail e telefone (quando
												necessário)
											</li>
											<li className="mt-2 ms-0">
												<FiArrowRight className="fea icon-sm me-2" />
												Dados de navegação: endereço IP, tipo de dispositivo,
												navegador, páginas acessadas
											</li>
											<li className="mt-2 ms-0">
												<FiArrowRight className="fea icon-sm me-2" />
												Informações fornecidas voluntariamente: formulários,
												cadastros e mensagens enviadas
											</li>
										</ul>

										<h5 className="card-title mb-1">2. Uso das Informações</h5>
										<p className="text-muted mb-0">
											Seus dados podem ser utilizados para:
										</p>
										<ul className="list-unstyled text-muted">
											<li className="mt-2 ms-0">
												<FiArrowRight className="fea icon-sm me-2" />
												Fornecer e melhorar nossos serviços
											</li>
											<li className="mt-2 ms-0">
												<FiArrowRight className="fea icon-sm me-2" />
												Enviar comunicações importantes sobre atualizações ou
												alterações
											</li>
											<li className="mt-2 ms-0">
												<FiArrowRight className="fea icon-sm me-2" />
												Cumprir obrigações legais e regulatórias
											</li>
											<li className="mt-2 ms-0">
												<FiArrowRight className="fea icon-sm me-2" />
												Realizar análises internas para aprimoramento da
												experiência do usuário
											</li>
										</ul>

										<h5 className="card-title mb-1">
											3. Compartilhamento de Dados
										</h5>
										<p className="text-muted mb-0">
											Não vendemos ou alugamos seus dados pessoais. Podemos
											compartilhar informações com:
										</p>
										<ul className="list-unstyled text-muted">
											<li className="mt-2 ms-0">
												<FiArrowRight className="fea icon-sm me-2" />
												Parceiros e prestadores de serviço essenciais para a
												operação do site
											</li>
											<li className="mt-2 ms-0">
												<FiArrowRight className="fea icon-sm me-2" />
												Autoridades competentes, quando exigido por lei
											</li>
										</ul>

										<h5 className="card-title mb-1">
											4. Segurança das Informações
										</h5>
										<p className="text-muted">
											Adotamos medidas técnicas e organizacionais para proteger
											seus dados contra acesso não autorizado, perda ou uso
											indevido. <br />O acesso é restrito apenas a colaboradores
											e parceiros autorizados.
										</p>

										<h5 className="card-title mb-1">5. Direitos do Titular</h5>
										<p className="text-muted mb-0">Você tem direito a:</p>
										<ul className="list-unstyled text-muted">
											<li className="mt-2 ms-0">
												<FiArrowRight className="fea icon-sm me-2" />
												Confirmar a existência de tratamento de dados
											</li>
											<li className="mt-2 ms-0">
												<FiArrowRight className="fea icon-sm me-2" />
												Acessar, corrigir, atualizar ou excluir suas informações
											</li>
											<li className="mt-2 ms-0">
												<FiArrowRight className="fea icon-sm me-2" />
												Solicitar a portabilidade dos dados
											</li>
											<li className="mt-2 ms-0">
												<FiArrowRight className="fea icon-sm me-2" />
												Revogar o consentimento a qualquer momento
											</li>
										</ul>
										<p className="text-muted">
											Para exercer seus direitos, entre em contato pelo e-mail:{" "}
											<Link
												href={`mailto:${contact.email}`}
												className="text-foot"
											>
												{contact.email}
											</Link>
										</p>

										<h5 className="card-title">6. Alterações na Política</h5>
										<p className="text-muted">
											Podemos atualizar esta Política de Privacidade
											periodicamente. Recomendamos que você consulte esta página
											regularmente para estar ciente das mudanças.
										</p>
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
