import TipoLanding from "../components/TipoLanding";
import { getBaseUrl, getSiteName } from "../helper/utils";

export const revalidate = 3600;

const cfg = {
	path: "/investimento",
	grupo: "investimento",
	h1: "Studios, lofts e NR para investir em São Paulo",
	intro: [
		"Studios, lofts e unidades NR (não residenciais) em lançamentos, obras e prédios prontos, pensados para quem quer comprar para alugar, inclusive por temporada. Cada card mostra a fase da obra, a metragem e o preço da unidade de investimento.",
		"Antes de comprar para locação de curta temporada, confira na convenção do condomínio se esse uso é permitido. Nos imóveis NR ele costuma ser previsto; nos residenciais depende de autorização expressa. Nossa equipe confere isso para você.",
	],
	subtipos: [
		{ value: "", label: "Todos" },
		{ value: "studio", label: "Studio" },
		{ value: "loft", label: "Loft" },
		{ value: "nr", label: "NR" },
	],
	alertaTitulo: "Receba novas oportunidades de investimento",
};

export const metadata = {
	title: `Studios, lofts e NR para investir em São Paulo | ${getSiteName()}`,
	description:
		"Studios, lofts e unidades NR para investir e alugar em São Paulo, em lançamentos, obras e prontos. Preço e metragem atualizados toda semana.",
	alternates: { canonical: `${getBaseUrl()}${cfg.path}` },
	openGraph: { title: cfg.h1, url: `${getBaseUrl()}${cfg.path}`, type: "website" },
};

export default function Page({ searchParams }) {
	return <TipoLanding cfg={cfg} searchParams={searchParams} />;
}
