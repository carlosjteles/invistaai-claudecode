import Link from "next/link";

import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollTop from "./ScrollTop";
import PropertyCard from "./PropertyCard";
import AlertaImoveis from "./AlertaImoveis";

import prisma from "../../db/prisma";
import { getBaseUrl } from "../helper/utils";
import { TIPOS_GRUPO } from "../storage/filters";

const FASES = [
	{ value: "", label: "Todas as fases" },
	{ value: "lancamento", label: "Lançamento", categorias: [1, 2] },
	{ value: "obra", label: "Em obras", categorias: [3] },
	{ value: "pronto", label: "Pronto novo", categorias: [4] },
];

const NOME_UNIDADE = {
	"Cobertura Duplex": "Cobertura duplex",
	"Cobertura Horizontal": "Cobertura horizontal",
	Duplex: "Duplex",
	Triplex: "Triplex",
	Garden: "Garden",
	Studio: "Studio",
	Loft: "Loft",
};

/** Unidade em destaque no card: a mais barata do tipo procurado (ou a maior, se não houver preço). */
function destaqueDo(item, tiposAceitos, ehNr) {
	const unidades = (Array.isArray(item.typelogies) ? item.typelogies : []).filter((t) => tiposAceitos.includes(t?.type));
	if (!unidades.length) return ehNr ? { rotulo: "NR · não residencial" } : null;
	const comPreco = unidades.filter((u) => Number(u.price) > 0).sort((a, b) => a.price - b.price);
	const u = comPreco[0] || [...unidades].sort((a, b) => (b.private_area || 0) - (a.private_area || 0))[0];
	const area = Number(u.private_area) || 0;
	const rotulo = `${ehNr ? "NR · " : ""}${NOME_UNIDADE[u.type] || u.type}${area ? ` · ${Math.round(area)} m²` : ""}`;
	return { rotulo, preco: Number(u.price) || 0, area };
}

async function ids(tipo) {
	try {
		return (await prisma.$queryRaw`select id from conteudo.ids_por_tipo(${tipo}) id`).map((r) => r.id);
	} catch (e) {
		return [];
	}
}

/**
 * Página temática por tipo de unidade (/coberturas, /gardens, /investimento).
 * cfg: { path, grupo, titulo, h1, intro[], subtipos: [{value, label}], alertaTitulo }
 * Filtros por URL: ?tipo=<subtipo>&fase=lancamento|obra|pronto
 */
export default async function TipoLanding({ cfg, searchParams = {} }) {
	const sub = cfg.subtipos?.find((s) => s.value && s.value === searchParams.tipo) || null;
	const fase = FASES.find((f) => f.value && f.value === searchParams.fase) || FASES[0];
	const tipoBusca = sub?.value || cfg.grupo;

	const [idsTipo, idsNr, bairros] = await Promise.all([
		ids(tipoBusca),
		cfg.grupo === "investimento" ? ids("nr") : Promise.resolve([]),
		prisma.$queryRaw`select slug, nome, bairros from conteudo.bairros where ativo order by ordem`.catch(() => []),
	]);

	const imoveis = await prisma.property.findMany({
		where: {
			id: { in: idsTipo },
			images: { some: {} },
			...(fase.categorias ? { category: { in: fase.categorias } } : {}),
		},
		include: { images: { where: { thumbnail: true }, select: { src: true, alt: true }, take: 1 } },
		orderBy: [{ category: "asc" }, { price: "desc" }],
	});

	const aceitos = TIPOS_GRUPO[tipoBusca] || TIPOS_GRUPO[cfg.grupo] || [];
	const nrSet = new Set(idsNr);
	const cards = imoveis.map((item) => ({ item, destaque: destaqueDo(item, aceitos, nrSet.has(item.id)) }));

	const nomesBairros = [...new Set(imoveis.map((i) => i.neighborhood).filter(Boolean))];
	const linksBairros = bairros.filter((b) => b.bairros.some((n) => nomesBairros.includes(n)));

	const url = `${getBaseUrl()}${cfg.path}`;
	const href = (tipo, f) => {
		const p = new URLSearchParams();
		if (tipo) p.set("tipo", tipo);
		if (f) p.set("fase", f);
		const q = p.toString();
		return q ? `${cfg.path}?${q}` : cfg.path;
	};

	const breadcrumb = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: getBaseUrl() },
			{ "@type": "ListItem", position: 2, name: cfg.h1, item: url },
		],
	};
	const lista = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: cfg.h1,
		numberOfItems: imoveis.length,
		itemListElement: imoveis.slice(0, 50).map((i, idx) => ({
			"@type": "ListItem",
			position: idx + 1,
			url: `${getBaseUrl()}/imovel/${i.slug}`,
			name: i.name,
		})),
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lista).replace(/</g, "\\u003c") }} />

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
								<h1 className="heading fw-semibold mb-0 sub-heading text-white title-dark">{cfg.h1}</h1>
							</div>
						</div>
					</div>
					<div className="position-middle-bottom">
						<nav aria-label="breadcrumb" className="d-block">
							<ul className="breadcrumb breadcrumb-muted mb-0 p-0">
								<li className="breadcrumb-item"><Link href="/">Início</Link></li>
								<li className="breadcrumb-item active" aria-current="page">{cfg.h1}</li>
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
					<div className="row">
						<div className="col-lg-9">
							{cfg.intro.map((p, i) => (
								<p key={i} className="text-muted">{p}</p>
							))}
						</div>
					</div>

					<div className="mt-3">
						{cfg.subtipos?.length > 0 && (
							<nav className="filtro-chips mb-3" aria-label="Filtrar por tipo de unidade">
								{cfg.subtipos.map((s) => (
									<Link key={s.label} href={href(s.value, fase.value)} className={(sub?.value || "") === s.value ? "ativo" : ""} scroll={false}>
										{s.label}
									</Link>
								))}
							</nav>
						)}
						<nav className="filtro-chips" aria-label="Filtrar por fase da obra">
							{FASES.map((f) => (
								<Link key={f.label} href={href(sub?.value, f.value)} className={fase.value === f.value ? "ativo" : ""} scroll={false}>
									{f.label}
								</Link>
							))}
						</nav>
					</div>

					<div className="row g-4 mt-2">
						{cards.length ? (
							cards.map(({ item, destaque }) => (
								<div className="col-lg-4 col-md-6 col-12" key={item.id}>
									<PropertyCard item={item} destaque={destaque} />
								</div>
							))
						) : (
							<div className="col-12">
								<p className="text-muted">Nenhum empreendimento com esse filtro no momento. Crie um alerta abaixo e avisamos quando entrar.</p>
							</div>
						)}
					</div>

					{linksBairros.length > 0 && (
						<div className="mt-5">
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
					)}

					<div className="mt-5">
						<AlertaImoveis
							bairros={bairros.map((b) => ({ slug: b.slug, nome: b.nome }))}
							titulo={cfg.alertaTitulo}
							origem={cfg.path}
						/>
					</div>
				</div>
			</section>
			<Footer />
			<ScrollTop />
		</>
	);
}
