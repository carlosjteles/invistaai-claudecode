import Link from "next/link";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollTop from "../components/ScrollTop";
import IndiceTable from "./IndiceTable";

import prisma from "../../db/prisma";
import { getBaseUrl, getSiteName } from "../helper/utils";

export const revalidate = 3600;

const URL = "/indice-preco-m2";
const MESES = [
	"janeiro", "fevereiro", "março", "abril", "maio", "junho",
	"julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const brl = (v) =>
	new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(Number(v));

const mesLabel = (d) => {
	const dt = new Date(d);
	return `${MESES[dt.getUTCMonth()]} de ${dt.getUTCFullYear()}`;
};

async function getDados() {
	try {
		const atual = await prisma.$queryRaw`
			with ult as (select max(mes) mes from orulo.indice_m2),
			     lim as (select max(atualizado_em) - interval '2 days' t from orulo.indice_m2 where mes = (select mes from ult))
			select bairro, n::int as n, mediana::float as mediana, p25::float as p25, p75::float as p75, mes, atualizado_em
			from orulo.indice_m2
			where mes = (select mes from ult) and atualizado_em >= (select t from lim)
			order by mediana desc`;
		const serie = await prisma.$queryRaw`
			select mes, mediana::float as mediana, n::int as n from orulo.indice_m2
			where bairro = 'São Paulo' order by mes`;
		const imoveis = await prisma.property.groupBy({
			by: ["neighborhood"],
			_count: { _all: true },
		});
		return { atual, serie, imoveis };
	} catch (e) {
		console.error("indice m2:", e);
		return { atual: [], serie: [], imoveis: [] };
	}
}

export async function generateMetadata() {
	const { atual } = await getDados();
	const cidade = atual.find((r) => r.bairro === "São Paulo");
	const quando = cidade ? mesLabel(cidade.mes) : "";
	const title = `Preço do m² em São Paulo por bairro ${quando ? `(${quando})` : ""}`.trim();
	const description = cidade
		? `Índice InvistaAí: preço mediano do m² de imóveis novos em São Paulo (${brl(cidade.mediana)}/m²) e em ${atual.length - 1} bairros, atualizado diariamente.`
		: "Índice InvistaAí: preço mediano do metro quadrado dos imóveis novos em São Paulo, por bairro.";
	return {
		title: `${title} | ${getSiteName()}`,
		description,
		keywords: ["preço do m² São Paulo", "preço metro quadrado por bairro", "valor do m² São Paulo", "índice preço m²", "lançamentos São Paulo preço"],
		alternates: { canonical: `${getBaseUrl()}${URL}` },
		openGraph: {
			title,
			description,
			url: `${getBaseUrl()}${URL}`,
			type: "website",
			images: [{ url: `${getBaseUrl()}/images/bg/properties.webp`, width: 1200, height: 630, alt: title }],
		},
	};
}

export default async function IndicePage() {
	const { atual, serie, imoveis } = await getDados();
	const cidade = atual.find((r) => r.bairro === "São Paulo");
	const bairros = atual.filter((r) => r.bairro !== "São Paulo");
	const noSite = Object.fromEntries(imoveis.map((i) => [i.neighborhood, i._count._all]));
	const linhas = bairros.map((b) => ({
		bairro: b.bairro,
		n: Number(b.n),
		mediana: Number(b.mediana),
		p25: Number(b.p25),
		p75: Number(b.p75),
		imoveisNoSite: noSite[b.bairro] || 0,
	}));
	const quando = cidade ? mesLabel(cidade.mes) : "";
	const atualizado = cidade
		? new Date(cidade.atualizado_em).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })
		: "";
	const top = bairros.slice(0, 3);
	const serieValida = serie.length >= 2;
	const maxSerie = serieValida ? Math.max(...serie.map((s) => s.mediana)) : 0;

	const datasetSchema = cidade && {
		"@context": "https://schema.org",
		"@type": "Dataset",
		name: "Índice InvistaAí de preço do m² de imóveis novos em São Paulo",
		description:
			"Preço mediano do metro quadrado anunciado nas tabelas de vendas de empreendimentos residenciais verticais novos (lançamento, em construção e pronto novo) na cidade de São Paulo, por bairro.",
		url: `${getBaseUrl()}${URL}`,
		creator: { "@type": "Organization", name: getSiteName(), url: getBaseUrl() },
		temporalCoverage: `${serie.length ? new Date(serie[0].mes).toISOString().slice(0, 7) : ""}/..`,
		spatialCoverage: { "@type": "Place", name: "São Paulo, SP, Brasil" },
		variableMeasured: "Preço mediano do m² (R$)",
		dateModified: new Date(cidade.atualizado_em).toISOString(),
		isAccessibleForFree: true,
	};

	return (
		<>
			{datasetSchema && (
				<script
					id="indice-schema"
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema).replace(/</g, "\\u003c") }}
				/>
			)}

			<Navbar navClass="defaultscroll sticky" logolight={true} menuClass="navigation-menu nav-center nav-light" />

			<section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/bg/properties.webp')" }}>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<p className="text-white-50 para-desc mx-auto mb-0">Índice InvistaAí</p>
								<h1 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
									Preço do m² em São Paulo por bairro
								</h1>
							</div>
						</div>
					</div>
					<div className="position-middle-bottom">
						<nav aria-label="breadcrumb" className="d-block">
							<ul className="breadcrumb breadcrumb-muted mb-0 p-0">
								<li className="breadcrumb-item"><Link href="/">Início</Link></li>
								<li className="breadcrumb-item active" aria-current="page">Preço do m²</li>
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
					{!cidade ? (
						<p className="text-muted text-center">Os dados do índice estão sendo atualizados. Volte em instantes.</p>
					) : (
						<>
							<div className="row g-4">
								<div className="col-lg-4 col-md-6">
									<div className="card border-0 shadow rounded-3 p-4 h-100">
										<p className="text-muted mb-1">Mediana da cidade de São Paulo</p>
										<h2 className="h3 fw-semibold mb-1 text-primary">{brl(cidade.mediana)}/m²</h2>
										<p className="text-muted small mb-0">
											{cidade.n.toLocaleString("pt-BR")} empreendimentos novos analisados · {quando}
										</p>
									</div>
								</div>
								<div className="col-lg-4 col-md-6">
									<div className="card border-0 shadow rounded-3 p-4 h-100">
										<p className="text-muted mb-1">Faixa central da cidade</p>
										<h2 className="h5 fw-semibold mb-1">
											{brl(cidade.p25)} a {brl(cidade.p75)}
										</h2>
										<p className="text-muted small mb-0">Metade dos empreendimentos está nessa faixa de preço por m².</p>
									</div>
								</div>
								<div className="col-lg-4 col-md-12">
									<div className="card border-0 shadow rounded-3 p-4 h-100">
										<p className="text-muted mb-1">Bairros com o m² mais alto</p>
										{top.map((b, i) => (
											<p className="mb-1" key={b.bairro}>
												<span className="fw-semibold">{i + 1}. {b.bairro}</span>{" "}
												<span className="text-muted">– {brl(b.mediana)}/m²</span>
											</p>
										))}
									</div>
								</div>
							</div>

							<div className="row mt-5">
								<div className="col-12">
									<h2 className="h4 fw-semibold mb-2">Preço mediano do m² por bairro</h2>
									<p className="text-muted">
										Busque um bairro ou ordene a tabela. Bairros marcados com imóveis no site têm link para os empreendimentos que a nossa equipe acompanha.
									</p>
									<IndiceTable linhas={linhas} cidade={cidade.mediana} />
								</div>
							</div>

							<div className="row mt-5">
								<div className="col-12">
									<h2 className="h4 fw-semibold mb-3">Evolução do preço do m² na cidade</h2>
									{serieValida ? (
										<div className="card border-0 shadow rounded-3 p-4">
											{serie.map((s) => (
												<div className="d-flex align-items-center mb-2" key={String(s.mes)}>
													<span className="text-muted small" style={{ width: 140 }}>{mesLabel(s.mes)}</span>
													<div className="flex-grow-1 bg-light rounded" style={{ height: 14 }}>
														<div className="bg-primary rounded" style={{ height: 14, width: `${(s.mediana / maxSerie) * 100}%` }}></div>
													</div>
													<span className="ms-3 fw-semibold small" style={{ width: 120, textAlign: "right" }}>{brl(s.mediana)}</span>
												</div>
											))}
										</div>
									) : (
										<p className="text-muted">
											A série histórica do índice começa em {quando}. A cada mês, um novo ponto é adicionado aqui, mostrando a evolução do preço do m² dos imóveis novos em São Paulo.
										</p>
									)}
								</div>
							</div>

							<div className="row mt-5">
								<div className="col-lg-8">
									<h2 className="h4 fw-semibold mb-3">Como o índice é calculado</h2>
									<p className="text-muted">
										O Índice InvistaAí usa o preço por metro quadrado informado nas tabelas de vendas de empreendimentos residenciais verticais <strong>novos</strong> (em lançamento, em construção ou prontos para morar) na cidade de São Paulo, a partir da base de dados da Órulo, plataforma usada por incorporadoras e imobiliárias.
									</p>
									<p className="text-muted">
										Para cada bairro calculamos a <strong>mediana</strong>, o valor do meio da lista, que é menos afetada por empreendimentos muito acima ou muito abaixo da média. Só entram no ranking os bairros com pelo menos 5 empreendimentos ativos. Imóveis usados e empreendimentos comerciais não fazem parte do cálculo.
									</p>
									<p className="text-muted">
										Os valores são preços <strong>pedidos</strong> nas tabelas das incorporadoras, não o preço final de negociação nem de imóveis usados. Por isso podem ser diferentes de índices que medem anúncios de revenda ou transações registradas em cartório. Os dados são atualizados diariamente{atualizado ? ` (última atualização em ${atualizado})` : ""}.
									</p>
									<p className="text-muted">
										Para ver lançamentos em um bairro específico, acesse a página de <Link href="/imoveis" className="fw-bold">imóveis à venda</Link> ou compare empreendimentos lado a lado no <Link href="/comparar" className="fw-bold">comparador de imóveis</Link>.
									</p>
								</div>
								<div className="col-lg-4">
									<div className="card border-0 shadow rounded-3 p-4">
										<h3 className="h6 fw-semibold">Quer o preço exato de um empreendimento?</h3>
										<p className="text-muted small">
											Receba a tabela atualizada, as plantas e as condições de pagamento com a nossa equipe.
										</p>
										<Link href="/contato" className="btn btn-pills btn-primary w-100">Falar com a equipe</Link>
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</section>
			<Footer />
			<ScrollTop />
		</>
	);
}
