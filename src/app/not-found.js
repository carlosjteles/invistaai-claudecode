import Error from "./error/page";

// Sem canonical: a página não existe, então apontar um canônico para a home é
// contraditório. E noindex, porque 404 não entra em índice nenhum.
// Em metadados do Next, o que o filho declara substitui o do layout — por isso
// alternates vazio zera o canonical herdado.
export const metadata = {
	title: "Página não encontrada",
	description:
		"A página que você procura não existe ou foi movida. Veja os imóveis de alto padrão disponíveis em São Paulo.",
	alternates: {},
	robots: { index: false, follow: true },
};

export default function NotFound() {
	return <Error />;
}
