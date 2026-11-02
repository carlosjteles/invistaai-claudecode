import TipoLanding from "../components/TipoLanding";
import { getBaseUrl, getSiteName } from "../helper/utils";

export const revalidate = 3600;

const cfg = {
	path: "/gardens",
	grupo: "garden",
	h1: "Apartamentos garden em São Paulo",
	intro: [
		"Apartamentos garden, com área externa privativa no térreo ou no primeiro pavimento, em lançamentos, obras e prédios prontos de alto padrão em São Paulo. Em cada card aparecem a metragem e o preço do garden.",
		"Os preços e a disponibilidade são conferidos toda semana nas tabelas das incorporadoras.",
	],
	subtipos: [],
	alertaTitulo: "Receba novos gardens no seu perfil",
};

export const metadata = {
	title: `Apartamento garden à venda em São Paulo | ${getSiteName()}`,
	description:
		"Apartamentos garden à venda em São Paulo, em lançamentos, obras e prontos de alto padrão. Metragem e preço do garden, atualizados toda semana.",
	alternates: { canonical: `${getBaseUrl()}${cfg.path}` },
	openGraph: { title: cfg.h1, url: `${getBaseUrl()}${cfg.path}`, type: "website" },
};

export default function Page({ searchParams }) {
	return <TipoLanding cfg={cfg} searchParams={searchParams} />;
}
