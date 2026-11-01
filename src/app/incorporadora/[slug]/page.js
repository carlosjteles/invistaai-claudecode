import Link from "next/link";
import { notFound } from "next/navigation";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollTop from "../../components/ScrollTop";
import PropertyCard from "../../components/PropertyCard";

import prisma from "../../../db/prisma";
import { getBaseUrl, getSiteName } from "../../helper/utils";
import { contact } from "../../storage/about";

export const revalidate = 3600;

const brl = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(Number(v));
const lista = (itens) => (itens.length <= 1 ? itens.join("") : `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`);
const ESTAGIO = { 1: "breve lançamento", 2: "lançamento", 3: "em construção", 4: "pronto para morar", 5: "investimento" };

async function getIncorporadora(slug) {
	try {
		const rows = await prisma.$queryRaw`
			select slug, nome, intro from conteudo.incorporadoras where slug = ${slug} and ativo limit 1`;
		return rows[0] || null;
	} catch (e) {
		console.error("incorporadora:", e);
		return null;
	}
}

async function getOutras(slug) {
	try {
		return await prisma.$queryRaw`
			select slug, nome from conteudo.incorporadoras where ativo and slug <> ${slug} order by ordem`;
	} catch (e) {
		return [];
	}
}

async function getBairros() {
	try {
		return await prisma.$queryRaw`select slug, nome, bairros from conteudo.bairros where ativo order by ordem`;
	} catch (e) {
		return [];
	}
}

async function getDados(slug) {
	const inc = await getIncorporadora(slug);
	if (!inc) return null;
	const [imoveis, outras, bairros] = await Promise.all([
		prisma.property.findMany({
			where: { seo: { path: ["developer"], equals: inc.nome }, images: { some: {} } },
			include: { images: { where: { thumbnail: true }, select: { src: true, alt: true }, take: 1 } },
			orderBy: [{ category: "asc" }, { price: "desc" }],
		}),
		getOutras(slug),
		getBairros(),
	]);
	return { inc, imoveis, outras, bairros };
}

export async function generateMetadata({ params }) {
	const dados = await getDados(params.slug);
	if (!dados) return { title: `Incorporadora não encontrada | ${getSiteName()}` };
	const { inc, imoveis } = dados;
	const title = `Lançamentos ${inc.nome} em São Paulo | ${getSiteName()}`;
	const bairros = [...new Set(imoveis.map((i) => i.neighborhood))].slice(0, 4);
	const description = `${imoveis.length} ${imoveis.length === 1 ? "empreendimento" : "empreendimentos"} da ${inc.nome} em São Paulo${bairros.length ? `, em ${lista(bairros)}` : ""}: preço, plantas, estágio da obra e entrega atualizados toda semana.`;
	const url = `${getBaseUrl()}/incorporadora/${inc.slug}`;
	return {
		title,
		description,
		alternates: { canonical: url },
		openGraph: {
			title,
			description,
			url,
			type: "website",
			images: imoveis[0]?.images?.[0]?.src ? [{ url: imoveis[0].images[0].src, alt: `Empreendimentos ${inc.nome}` }] : [],
		},
	};
}

export default async function IncorporadoraPage({ params }) {
	const dados = await getDados(params.slug);
	if (!dados) notFound();
	const { inc, imoveis, outras, bairros } = dados;

	const url = `${getBaseUrl()}/incorporadora/${inc.slug}`;
	const precos = imoveis.map((i) => i.price).filter((p) => p > 0);
	const pMin = precos.length ? Math.min(...precos) : 0;
	const nomesBairros = [...new Set(imoveis.map((i) => i.neighborhood).filter(Boolean))];
	const porEstagio = Object.entries(
		imoveis.reduce((acc, i) => ({ ...acc, [i.category]: (acc[i.category] || 0) + 1 }), {})
	).map(([c, n]) => `${n} ${ESTAGIO[c] || "outros"}`);
	const linksBairros = bairros.filter((b) => b.bairros.some((n) => nomesBairros.includes(n)));

	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: getBaseUrl() },
			{ "@type": "ListItem", position: 2, name: "Incorporadoras", item: `${getBaseUrl()}/incorporadoras` },
			{ "@type": "ListItem", position: 3, name: inc.nome, item: url },
		],
	};
	const listSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: `Empreendimentos ${inc.nome} em São Paulo`,
		numberOfItems: imoveis.length,
		itemListElement: imoveis.map((i, idx) => ({ "@type": "ListItem", position: idx + 1, url: `${getBaseUrl()}/imovel/${i.slug}`, name: i.name })),
	};
	const whatsapp = `https://wa.me/${contact.phone}?text=${encodeURIComponent(`Olá! Vi os empreendimentos da ${inc.nome} no site da InvistaAí e gostaria de mais informações.`)}`;

	return (
		<>
			<script id="inc-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
			<script id="inc-itemlist" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema).replace(/</g, "\\u003c") }} />

			<Navbar navClass="defaultscroll sticky" logolight={true} menuClass="navigation-menu nav-center nav-light" />

			<section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/bg/properties.webp')" }}>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<p className="text-white-50 para-desc mx-auto mb-0">
									{imoveis.length} {imoveis.length === 1 ? "empreendimento" : "empreendimentos"} em São Paulo
								</p>
								<h1 className="heading fw-semibold mb-0 sub-heading text-white title-dark">Lançamentos {inc.nome}</h1>
							</div>
						</div>
					</div>
					<div className="position-middle-bottom">
						<nav aria-label="breadcrumb" className="d-block">
							<ul className="breadcrumb breadcrumb-muted mb-0 p-0">
								<li className="breadcrumb-item"><Link href="/">Início</Link></li>
								<li className="breadcrumb-item"><Link href="/incorporadoras">Incorporadoras</Link></li>
								<li className="breadcrumb-item active" aria-current="page">{inc.nome}</li>
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
					<div className="row g-4">
						<div className="col-lg-8">
							<h2 className="h4 fw-semibold mb-3">Sobre a {inc.nome}</h2>
							<p className="text-muted">{inc.intro}</p>
							<p className="text-muted">
								Acompanhamos {imoveis.length} {imoveis.length === 1 ? "empreendimento" : "empreendimentos"} da {inc.nome}
								{nomesBairros.length ? ` em ${lista(nomesBairros)}` : ""}
								{porEstagio.length ? ` (${lista(porEstagio)})` : ""}, com preço, plantas e prazo de entrega atualizados toda semana a partir das tabelas da incorporadora.
							</p>
						</div>
						<div className="col-lg-4">
							<div className="card border-0 shadow rounded-3 p-4">
								<p className="text-muted mb-1">Empreendimentos no site</p>
								<p className="h4 fw-semibold mb-3">{imoveis.length}</p>
								{pMin > 0 && (
									<>
										<p className="text-muted mb-1">Preços a partir de</p>
										<p className="h5 fw-semibold mb-3">{brl(pMin)}</p>
									</>
								)}
								<a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-pills btn-primary w-100">
									Receber tabelas da {inc.nome}
								</a>
							</div>
						</div>
					</div>

					<div className="row mt-5">
						<div className="col-12">
							<h2 className="h4 fw-semibold mb-4">Empreendimentos {inc.nome}</h2>
						</div>
					</div>
					<div className="row g-4">
						{imoveis.map((item) => (
							<div className="col-lg-4 col-md-6 col-12" key={item.id}>
								<PropertyCard item={item} />
							</div>
						))}
					</div>

					{linksBairros.length > 0 && (
						<div className="row mt-5">
							<div className="col-12">
								<h2 className="h5 fw-semibold mb-3">Veja também por bairro</h2>
								<p className="mb-0">
									{linksBairros.map((b, i) => (
										<span key={b.slug}>
											<Link href={`/bairro/${b.slug}`} className="text-primary">{b.nome}</Link>
											{i < linksBairros.length - 1 ? " · " : ""}
										</span>
									))}
								</p>
							</div>
						</div>
					)}

					{outras.length > 0 && (
						<div className="row mt-4">
							<div className="col-12">
								<h2 className="h5 fw-semibold mb-3">Outras incorporadoras</h2>
								<p className="mb-0">
									{outras.map((o, i) => (
										<span key={o.slug}>
											<Link href={`/incorporadora/${o.slug}`} className="text-primary">{o.nome}</Link>
											{i < outras.length - 1 ? " · " : ""}
										</span>
									))}
								</p>
							</div>
						</div>
					)}
				</div>
			</section>
			<Footer />
			<ScrollTop />
		</>
	);
}
