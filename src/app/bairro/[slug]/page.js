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

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const brl = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(Number(v));
const milM2 = (v) => `R$ ${(Number(v) / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mil/m²`;
const mesLabel = (d) => {
	const dt = new Date(d);
	return `${MESES[dt.getUTCMonth()]} de ${dt.getUTCFullYear()}`;
};
const lista = (itens) => (itens.length <= 1 ? itens.join("") : `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`);

async function getBairro(slug) {
	try {
		const rows = await prisma.$queryRaw`
			select slug, nome, prep, bairros, extras, guia_slug, intro from conteudo.bairros where slug = ${slug} and ativo limit 1`;
		return rows[0] || null;
	} catch (e) {
		console.error("bairro:", e);
		return null;
	}
}

async function getOutros(slug) {
	try {
		return await prisma.$queryRaw`
			select b.slug, b.nome from conteudo.bairros b where b.ativo and b.slug <> ${slug} order by b.ordem`;
	} catch (e) {
		return [];
	}
}

async function getIndice(nomes) {
	try {
		return await prisma.$queryRaw`
			with ult as (select max(mes) mes from orulo.indice_m2)
			select bairro, mediana::float as mediana, n::int as n, mes from orulo.indice_m2
			where mes = (select mes from ult) and bairro = any(${nomes}) order by n desc`;
	} catch (e) {
		return [];
	}
}

async function getDados(slug) {
	const bairro = await getBairro(slug);
	if (!bairro) return null;
	const [imoveis, indice, outros] = await Promise.all([
		prisma.property.findMany({
			where: {
				OR: [{ neighborhood: { in: bairro.bairros } }, { slug: { in: bairro.extras || [] } }],
				images: { some: {} },
			},
			include: { images: { where: { thumbnail: true }, select: { src: true, alt: true }, take: 1 } },
			orderBy: [{ category: "asc" }, { price: "desc" }],
		}),
		getIndice(bairro.bairros),
		getOutros(slug),
	]);
	return { bairro, imoveis, indice, outros };
}

export async function generateMetadata({ params }) {
	const dados = await getDados(params.slug);
	if (!dados) return { title: `Bairro não encontrado | ${getSiteName()}` };
	const { bairro, imoveis } = dados;
	const precos = imoveis.map((i) => i.price).filter((p) => p > 0);
	const title = `Apartamentos de alto padrão ${bairro.prep} | ${getSiteName()}`;
	const description =
		`${imoveis.length} ${imoveis.length === 1 ? "empreendimento" : "empreendimentos"} ${bairro.prep}, São Paulo: lançamentos, obras e prontos` +
		(precos.length ? ` a partir de ${brl(Math.min(...precos))}` : "") +
		". Preço, plantas, preço do m² e entrega atualizados toda semana.";
	const url = `${getBaseUrl()}/bairro/${bairro.slug}`;
	return {
		title,
		description,
		alternates: { canonical: url },
		openGraph: {
			title,
			description,
			url,
			type: "website",
			images: imoveis[0]?.images?.[0]?.src ? [{ url: imoveis[0].images[0].src, alt: `Imóveis ${bairro.prep}` }] : [],
		},
	};
}

export default async function BairroPage({ params }) {
	const dados = await getDados(params.slug);
	if (!dados) notFound();
	const { bairro, imoveis, indice, outros } = dados;

	const url = `${getBaseUrl()}/bairro/${bairro.slug}`;
	const precos = imoveis.map((i) => i.price).filter((p) => p > 0);
	const pMin = precos.length ? Math.min(...precos) : 0;
	const pMax = precos.length ? Math.max(...precos) : 0;
	const prontos = imoveis.filter((i) => i.category === 4).length;
	const incorporadoras = [...new Set(imoveis.map((i) => i.seo?.developer).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
	const quando = indice[0] ? mesLabel(indice[0].mes) : "";

	const faq = [
		pMin > 0 && {
			q: `Quanto custa um apartamento de alto padrão ${bairro.prep}?`,
			a: `Entre os empreendimentos que acompanhamos ${bairro.prep}, os preços partem de ${brl(pMin)}${pMax > pMin ? ` e chegam a ${brl(pMax)}` : ""}, conforme as tabelas mais recentes das incorporadoras. Os valores mudam com frequência, então confirme a disponibilidade com a nossa equipe.`,
		},
		indice.length > 0 && {
			q: `Qual é o preço do m² ${bairro.prep}?`,
			a: `Pelo Índice InvistaAí de ${quando}, o preço mediano do m² de imóveis novos é de ${lista(indice.map((r) => `${milM2(r.mediana)} em ${r.bairro}`))}. O índice considera lançamentos, obras e prontos novos, com base nas tabelas das incorporadoras.`,
		},
		incorporadoras.length > 0 && {
			q: `Quais incorporadoras têm empreendimentos ${bairro.prep}?`,
			a: `Acompanhamos projetos de ${lista(incorporadoras)} ${bairro.prep}.`,
		},
		{
			q: `Há imóveis prontos para morar ${bairro.prep}?`,
			a: prontos
				? `Sim. Hoje acompanhamos ${prontos} ${prontos === 1 ? "empreendimento pronto" : "empreendimentos prontos"} para morar ${bairro.prep}; os demais estão em lançamento ou em obras.`
				: `No momento, os empreendimentos que acompanhamos ${bairro.prep} estão em lançamento ou em obras. Fale com a nossa equipe para saber de unidades prontas e revendas.`,
		},
	].filter(Boolean);

	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: getBaseUrl() },
			{ "@type": "ListItem", position: 2, name: "Bairros", item: `${getBaseUrl()}/bairros` },
			{ "@type": "ListItem", position: 3, name: bairro.nome, item: url },
		],
	};
	const listSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: `Apartamentos de alto padrão ${bairro.prep}`,
		numberOfItems: imoveis.length,
		itemListElement: imoveis.map((i, idx) => ({
			"@type": "ListItem",
			position: idx + 1,
			url: `${getBaseUrl()}/imovel/${i.slug}`,
			name: i.name,
		})),
	};
	const whatsapp = `https://wa.me/${contact.phone}?text=${encodeURIComponent(`Olá! Vi os imóveis ${bairro.prep} no site da InvistaAí e gostaria de mais informações.`)}`;

	return (
		<>
			<script id="bairro-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
			<script id="bairro-itemlist" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema).replace(/</g, "\\u003c") }} />

			<Navbar navClass="defaultscroll sticky" logolight={true} menuClass="navigation-menu nav-center nav-light" />

			<section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/bg/properties.webp')" }}>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<p className="text-white-50 para-desc mx-auto mb-0">
									{imoveis.length} {imoveis.length === 1 ? "empreendimento" : "empreendimentos"} selecionados
								</p>
								<h1 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
									Apartamentos de alto padrão {bairro.prep}
								</h1>
							</div>
						</div>
					</div>
					<div className="position-middle-bottom">
						<nav aria-label="breadcrumb" className="d-block">
							<ul className="breadcrumb breadcrumb-muted mb-0 p-0">
								<li className="breadcrumb-item"><Link href="/">Início</Link></li>
								<li className="breadcrumb-item"><Link href="/bairros">Bairros</Link></li>
								<li className="breadcrumb-item active" aria-current="page">{bairro.nome}</li>
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
							<h2 className="h4 fw-semibold mb-3">Morar {bairro.prep}</h2>
							{bairro.intro.map((p, i) => (
								<p className="text-muted" key={i}>{p}</p>
							))}
							{bairro.guia_slug && (
								<p className="text-muted">
									Quer conhecer melhor a região? Leia o nosso{" "}
									<Link href={`/blog/${bairro.guia_slug}`} className="text-primary text-decoration-underline">guia completo do bairro</Link>.
								</p>
							)}
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
								{indice.length > 0 && (
									<>
										<p className="text-muted mb-1">Preço mediano do m² (imóveis novos)</p>
										{indice.map((r) => (
											<p className="mb-1" key={r.bairro}>
												<span className="fw-semibold">{milM2(r.mediana)}</span> <span className="text-muted small">– {r.bairro}</span>
											</p>
										))}
										<p className="small mt-2 mb-0">
											<Link href="/indice-preco-m2" className="text-primary text-decoration-underline">Ver o índice completo</Link>
										</p>
									</>
								)}
							</div>
						</div>
					</div>

					<div className="row mt-5">
						<div className="col-12">
							<h2 className="h4 fw-semibold mb-4">Lançamentos e imóveis {bairro.prep}</h2>
						</div>
					</div>
					<div className="row g-4">
						{imoveis.map((item) => (
							<div className="col-lg-4 col-md-6 col-12" key={item.id}>
								<PropertyCard item={item} />
							</div>
						))}
					</div>
					{imoveis.length > 1 && (
						<p className="text-center mt-4 mb-0">
							<Link href={`/comparar?imoveis=${imoveis.slice(0, 3).map((i) => i.slug).join(",")}`} className="btn btn-pills btn-soft-primary">
								Comparar imóveis {bairro.prep}
							</Link>
						</p>
					)}

					<div className="row mt-5">
						<div className="col-lg-8">
							<h2 className="h4 fw-semibold mb-3">Perguntas frequentes sobre imóveis {bairro.prep}</h2>
							{faq.map((f) => (
								<div className="mb-4" key={f.q}>
									<h3 className="h6 fw-semibold mb-1">{f.q}</h3>
									<p className="text-muted mb-0">{f.a}</p>
								</div>
							))}
						</div>
						<div className="col-lg-4">
							<div className="card border-0 shadow rounded-3 p-4">
								<h3 className="h6 fw-semibold">Quer ajuda para escolher {bairro.prep}?</h3>
								<p className="text-muted small">Receba tabelas, plantas e condições de pagamento dos empreendimentos do bairro.</p>
								<a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-pills btn-primary w-100">
									Falar pelo WhatsApp
								</a>
							</div>
						</div>
					</div>

					{outros.length > 0 && (
						<div className="row mt-5">
							<div className="col-12">
								<h2 className="h5 fw-semibold mb-3">Outros bairros</h2>
								<p className="mb-0">
									{outros.map((o, i) => (
										<span key={o.slug}>
											<Link href={`/bairro/${o.slug}`} className="text-primary">{o.nome}</Link>
											{i < outros.length - 1 ? " · " : ""}
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
