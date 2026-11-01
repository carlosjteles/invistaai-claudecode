import Link from "next/link";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollTop from "../components/ScrollTop";
import CompararClient from "./CompararClient";

import prisma from "../../db/prisma";
import { categories } from "../storage/filters";
import { getBaseUrl, getSiteName } from "../helper/utils";

export const revalidate = 300;

export const metadata = {
	title: `Comparar imóveis lado a lado | ${getSiteName()}`,
	description:
		"Compare até 3 empreendimentos lado a lado: metragem, preço por m², suítes, vagas, lazer, distância do metrô e data de entrega dos lançamentos em São Paulo.",
	keywords: ["comparar imóveis", "comparador de imóveis", "comparar lançamentos São Paulo", "preço por m²"],
	alternates: { canonical: `${getBaseUrl()}/comparar` },
	openGraph: {
		title: `Comparar imóveis lado a lado | ${getSiteName()}`,
		description: "Compare até 3 empreendimentos lado a lado: metragem, preço por m², suítes, vagas, lazer e entrega.",
		url: `${getBaseUrl()}/comparar`,
		type: "website",
		images: [{ url: `${getBaseUrl()}/images/bg/properties.webp`, width: 1200, height: 630, alt: "Comparador de imóveis" }],
	},
};

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function entrega(valor) {
	if (!valor) return null;
	const p = String(valor).split("/");
	if (p.length === 3) return `${MESES[Number(p[1]) - 1]}/${p[2]}`;
	if (p.length === 2) return `${MESES[Number(p[0]) - 1]}/${p[1]}`;
	return valor;
}

function metro(description) {
	if (!Array.isArray(description)) return null;
	const bloco = description.find((b) => typeof b?.title === "string" && b.title.startsWith("Localização"));
	const item = bloco?.list?.[0];
	if (!item || !/Metrô|Estação/.test(item)) return null;
	return item;
}

function precoM2(typelogies) {
	if (!Array.isArray(typelogies)) return null;
	const vals = typelogies
		.filter((t) => Number(t?.price) > 0 && Number(t?.private_area) > 0)
		.map((t) => Number(t.price) / Number(t.private_area));
	return vals.length ? Math.round(Math.min(...vals)) : null;
}

async function getImoveis() {
	const rows = await prisma.property.findMany({
		select: {
			slug: true, name: true, neighborhood: true, category: true, price: true, preview: true,
			typelogies: true, attributes: true, delivery_in: true, seo: true, description: true,
			images: { where: { thumbnail: true }, select: { src: true, alt: true }, take: 1 },
		},
		orderBy: { name: "asc" },
	});
	return rows.map((p) => ({
		slug: p.slug,
		nome: p.name.split(" - ")[0],
		incorporadora: p.seo?.developer || p.name.split(" - ")[1] || "",
		bairro: p.neighborhood,
		estagio: categories.find((c) => c.id === p.category)?.label || "",
		preco: p.price > 0 ? p.price : null,
		precoM2: precoM2(p.typelogies),
		area: p.preview?.area || "",
		dormitorios: p.preview?.bedroom || "",
		suites: p.preview?.suite || "",
		vagas: p.preview?.parking || "",
		plantas: Array.isArray(p.typelogies) ? p.typelogies.length : 0,
		lazer: p.attributes || [],
		entrega: entrega(p.delivery_in),
		metro: metro(p.description),
		foto: p.images?.[0]?.src || null,
		fotoAlt: p.images?.[0]?.alt || p.name,
	}));
}

export default async function CompararPage({ searchParams }) {
	const imoveis = await getImoveis();
	const iniciais = String(searchParams?.imoveis || "")
		.split(",")
		.map((s) => s.trim())
		.filter((s) => imoveis.some((i) => i.slug === s))
		.slice(0, 3);

	return (
		<>
			<Navbar navClass="defaultscroll sticky" logolight={true} menuClass="navigation-menu nav-center nav-light" />

			<section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/bg/properties.webp')" }}>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<p className="text-white-50 para-desc mx-auto mb-0">Ferramenta InvistaAí</p>
								<h1 className="heading fw-semibold mb-0 sub-heading text-white title-dark">Comparar imóveis</h1>
							</div>
						</div>
					</div>
					<div className="position-middle-bottom">
						<nav aria-label="breadcrumb" className="d-block">
							<ul className="breadcrumb breadcrumb-muted mb-0 p-0">
								<li className="breadcrumb-item"><Link href="/">Início</Link></li>
								<li className="breadcrumb-item active" aria-current="page">Comparar imóveis</li>
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
					<div className="row justify-content-center mb-4">
						<div className="col-lg-8 text-center">
							<p className="text-muted mb-0">
								Escolha até 3 empreendimentos e veja lado a lado metragem, preço por m², suítes, vagas, lazer, distância do metrô e data de entrega.
								Os preços são os da tabela mais recente e podem mudar sem aviso.
							</p>
						</div>
					</div>
					<CompararClient imoveis={imoveis} iniciais={iniciais} />
					<p className="text-muted small text-center mt-4 mb-0">
						Quer entender o preço do m² de cada bairro? Veja o <Link href="/indice-preco-m2" className="fw-bold">Índice InvistaAí de preço do m²</Link>.
					</p>
				</div>
			</section>
			<Footer />
			<ScrollTop />
		</>
	);
}
