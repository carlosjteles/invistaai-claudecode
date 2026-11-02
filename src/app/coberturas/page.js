import TipoLanding from "../components/TipoLanding";
import { getBaseUrl, getSiteName } from "../helper/utils";

export const revalidate = 3600;

const cfg = {
	path: "/coberturas",
	grupo: "cobertura",
	h1: "Coberturas e duplex em São Paulo",
	intro: [
		"Coberturas duplex, coberturas horizontais, duplex e triplex disponíveis em lançamentos, obras e prédios prontos de alto padrão em São Paulo. Em cada card aparecem a metragem e o preço da cobertura (ou do duplex), não do apartamento-tipo.",
		"Os preços e a disponibilidade são conferidos toda semana nas tabelas das incorporadoras. Peça a tabela completa para ver todas as unidades de cobertura de cada prédio.",
	],
	subtipos: [
		{ value: "", label: "Todas" },
		{ value: "cobertura-duplex", label: "Cobertura duplex" },
		{ value: "cobertura-horizontal", label: "Cobertura horizontal" },
		{ value: "duplex", label: "Duplex e triplex" },
	],
	alertaTitulo: "Receba novas coberturas no seu perfil",
};

export const metadata = {
	title: `Coberturas à venda em São Paulo: duplex e horizontais | ${getSiteName()}`,
	description:
		"Coberturas duplex, horizontais, duplex e triplex à venda em São Paulo, em lançamentos, obras e prontos. Metragem e preço da cobertura, atualizados toda semana.",
	alternates: { canonical: `${getBaseUrl()}${cfg.path}` },
	openGraph: { title: cfg.h1, url: `${getBaseUrl()}${cfg.path}`, type: "website" },
};

export default function Page({ searchParams }) {
	return <TipoLanding cfg={cfg} searchParams={searchParams} />;
}
