import Link from "next/link";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollTop from "../components/ScrollTop";

import prisma from "../../db/prisma";
import { getBaseUrl, getSiteName } from "../helper/utils";

export const revalidate = 3600;

const brl = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(Number(v));
const milM2 = (v) => `R$ ${(Number(v) / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mil/m²`;

export const metadata = {
	title: `Bairros de alto padrão em São Paulo | ${getSiteName()}`,
	description:
		"Lançamentos e imóveis de alto padrão por bairro em São Paulo: Moema, Jardins, Itaim Bibi, Pinheiros, Vila Nova Conceição e mais, com preço do m² e empreendimentos atualizados.",
	alternates: { canonical: `${getBaseUrl()}/bairros` },
};

async function getBairros() {
	try {
		return await prisma.$queryRaw`
			with ult as (select max(mes) mes from orulo.indice_m2)
			select b.slug, b.nome, b.intro[1] as resumo,
				(select count(*)::int from "Property" p where (p.neighborhood = any(b.bairros) or p.slug = any(b.extras))
					and exists (select 1 from "PropertyImage" i where i."propertyId" = p.id)) as imoveis,
				(select min(nullif(p.price, 0))::float from "Property" p where (p.neighborhood = any(b.bairros) or p.slug = any(b.extras))
					and exists (select 1 from "PropertyImage" i where i."propertyId" = p.id)) as preco_min,
				(select i.mediana::float from orulo.indice_m2 i where i.mes = (select mes from ult) and i.bairro = any(b.bairros)
					order by i.n desc limit 1) as m2
			from conteudo.bairros b where b.ativo order by b.ordem`;
	} catch (e) {
		console.error("bairros:", e);
		return [];
	}
}

export default async function BairrosPage() {
	const bairros = await getBairros();
	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: getBaseUrl() },
			{ "@type": "ListItem", position: 2, name: "Bairros", item: `${getBaseUrl()}/bairros` },
		],
	};

	return (
		<>
			<script id="bairros-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
			<Navbar navClass="defaultscroll sticky" logolight={true} menuClass="navigation-menu nav-center nav-light" />

			<section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/bg/properties.webp')" }}>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<h1 className="heading fw-semibold mb-0 sub-heading text-white title-dark">Bairros de alto padrão em São Paulo</h1>
							</div>
						</div>
					</div>
					<div className="position-middle-bottom">
						<nav aria-label="breadcrumb" className="d-block">
							<ul className="breadcrumb breadcrumb-muted mb-0 p-0">
								<li className="breadcrumb-item"><Link href="/">Início</Link></li>
								<li className="breadcrumb-item active" aria-current="page">Bairros</li>
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
						Escolha um bairro para ver os lançamentos, as obras e os imóveis prontos de alto padrão que acompanhamos, com preço, plantas e preço do m² atualizados.
					</p>
					<div className="row g-4">
						{bairros.map((b) => (
							<div className="col-lg-4 col-md-6 col-12" key={b.slug}>
								<Link href={`/bairro/${b.slug}`} className="card border-0 shadow rounded-3 p-4 h-100 text-dark">
									<h2 className="h5 fw-semibold mb-2">{b.nome}</h2>
									<p className="text-muted small mb-3">{b.resumo.length > 150 ? `${b.resumo.slice(0, 147).trim()}…` : b.resumo}</p>
									<p className="small mb-0">
										<span className="fw-semibold">{b.imoveis}</span> {b.imoveis === 1 ? "empreendimento" : "empreendimentos"}
										{b.preco_min ? <> · a partir de <span className="fw-semibold">{brl(b.preco_min)}</span></> : null}
										{b.m2 ? <> · {milM2(b.m2)}</> : null}
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
