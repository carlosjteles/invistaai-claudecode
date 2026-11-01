import Link from "next/link";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollTop from "../components/ScrollTop";

import prisma from "../../db/prisma";
import { getBaseUrl, getSiteName } from "../helper/utils";

export const revalidate = 3600;

export const metadata = {
	title: `Incorporadoras de alto padrão em São Paulo | ${getSiteName()}`,
	description:
		"Lançamentos das principais incorporadoras de alto padrão de São Paulo: Cyrela, Exto, Benx, Trisul, Lavvi, RFM, Lindenberg e outras, com preço e entrega atualizados.",
	alternates: { canonical: `${getBaseUrl()}/incorporadoras` },
};

async function getIncorporadoras() {
	try {
		return await prisma.$queryRaw`
			select i.slug, i.nome, i.intro,
				(select count(*)::int from "Property" p where p.seo->>'developer' = i.nome
					and exists (select 1 from "PropertyImage" x where x."propertyId" = p.id)) as imoveis
			from conteudo.incorporadoras i where i.ativo order by i.ordem`;
	} catch (e) {
		console.error("incorporadoras:", e);
		return [];
	}
}

export default async function IncorporadorasPage() {
	const lista = await getIncorporadoras();
	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: getBaseUrl() },
			{ "@type": "ListItem", position: 2, name: "Incorporadoras", item: `${getBaseUrl()}/incorporadoras` },
		],
	};

	return (
		<>
			<script id="inc-list-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
			<Navbar navClass="defaultscroll sticky" logolight={true} menuClass="navigation-menu nav-center nav-light" />

			<section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/bg/properties.webp')" }}>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<h1 className="heading fw-semibold mb-0 sub-heading text-white title-dark">Incorporadoras de alto padrão</h1>
							</div>
						</div>
					</div>
					<div className="position-middle-bottom">
						<nav aria-label="breadcrumb" className="d-block">
							<ul className="breadcrumb breadcrumb-muted mb-0 p-0">
								<li className="breadcrumb-item"><Link href="/">Início</Link></li>
								<li className="breadcrumb-item active" aria-current="page">Incorporadoras</li>
							</ul>
						</nav>
					</div>
				</div>
			</section>
			<div className="position-relative">
				<div className="shape overflow-hidden text-white">
					<svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
					</svg>
				</div>
			</div>

			<section className="section">
				<div className="container">
					<p className="text-muted para-desc mb-4">
						Veja os lançamentos e imóveis de alto padrão em São Paulo organizados por incorporadora, com preço, plantas e entrega atualizados.
					</p>
					<div className="row g-4">
						{lista.map((i) => (
							<div className="col-lg-4 col-md-6 col-12" key={i.slug}>
								<Link href={`/incorporadora/${i.slug}`} className="card border-0 shadow rounded-3 p-4 h-100 text-dark">
									<h2 className="h5 fw-semibold mb-2">{i.nome}</h2>
									<p className="text-muted small mb-3">{i.intro}</p>
									<p className="small mb-0">
										<span className="fw-semibold">{i.imoveis}</span> {i.imoveis === 1 ? "empreendimento" : "empreendimentos"} no site
									</p>
								</Link>
							</div>
						))}
					</div>
				</div>
			</section>
			<Footer />
			<ScrollTop />
		</>
	);
}
