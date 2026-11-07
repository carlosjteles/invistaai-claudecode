// Helpers para montar o JSON-LD das páginas de imóvel.
// O conteúdo já existe na página; aqui a gente só traduz para o vocabulário
// que o Google e os modelos de busca entendem.

import { contact } from "../storage/about";
import { getBaseUrl, getSiteName } from "./utils";

const semTags = (texto) =>
	String(texto || "")
		.replace(/<br\s*\/?>/gi, " ")
		.replace(/<[^>]+>/g, "")
		.replace(/&nbsp;/g, " ")
		.replace(/\s+/g, " ")
		.trim();

/**
 * Extrai as perguntas e respostas dos blocos de descrição.
 * O padrão gravado é "<strong>Pergunta?</strong><br>Resposta".
 */
export function faqDoDescription(description) {
	if (!Array.isArray(description)) return [];

	const blocos = description.filter(
		(bloco) =>
			bloco &&
			typeof bloco === "object" &&
			/pergunta|frequen|d[úu]vida/i.test(String(bloco.title || "")),
	);

	const perguntas = [];
	for (const bloco of blocos) {
		const linhas = [
			...(Array.isArray(bloco.content) ? bloco.content : []),
			...(Array.isArray(bloco.list) ? bloco.list : []),
		];

		for (const linha of linhas) {
			if (typeof linha !== "string") continue;
			const m = linha.match(/<strong>(.*?)<\/strong>\s*(?:<br\s*\/?>)?([\s\S]*)/i);
			if (!m) continue;
			const q = semTags(m[1]);
			const a = semTags(m[2]);
			if (q.length > 5 && a.length > 5) perguntas.push({ q, a });
		}
	}

	// o Google ignora duplicadas; melhor não mandar
	const vistas = new Set();
	return perguntas.filter((p) => {
		const chave = p.q.toLowerCase();
		if (vistas.has(chave)) return false;
		vistas.add(chave);
		return true;
	});
}

/** Lê as coordenadas do iframe do Google Maps guardado em description_embed. */
export function coordsDoEmbed(embed) {
	const m = String(embed || "").match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
	if (!m) return null;
	return { lat: Number(m[1]), lon: Number(m[2]) };
}

const numero = (v) => {
	const n = Number(v);
	return Number.isFinite(n) && n > 0 ? n : null;
};

/**
 * Cada tipologia vira uma Apartment com a planta dentro.
 * É o dado que diferencia o site: área, dormitórios e preço por planta.
 */
export function plantasSchema(typelogies, nomeImovel) {
	if (!Array.isArray(typelogies)) return [];

	return typelogies
		.map((t) => {
			if (!t || typeof t !== "object") return null;
			const area = numero(t.private_area);
			const dorms = numero(t.bedrooms);
			const banhos = numero(t.bathrooms);
			const suites = numero(t.suites);
			const vagas = numero(t.parking);
			const preco = numero(t.price);
			if (!area && !dorms) return null;

			const rotulo = [t.type, area ? `${area} m²` : null, dorms ? `${dorms} dorms` : null]
				.filter(Boolean)
				.join(" · ");

			const planta = {
				"@type": "FloorPlan",
				name: rotulo,
				...(area && {
					floorSize: { "@type": "QuantitativeValue", value: area, unitCode: "MTK" },
				}),
				...(dorms && { numberOfBedrooms: dorms }),
				...(banhos && { numberOfBathroomsTotal: banhos }),
				...(dorms && { numberOfRooms: dorms }),
			};

			return {
				"@type": "Apartment",
				name: nomeImovel ? `${nomeImovel} — ${rotulo}` : rotulo,
				...(area && {
					floorSize: { "@type": "QuantitativeValue", value: area, unitCode: "MTK" },
				}),
				...(dorms && { numberOfRooms: dorms, numberOfBedrooms: dorms }),
				...(banhos && { numberOfBathroomsTotal: banhos }),
				accommodationFloorPlan: planta,
				...((suites || vagas || preco) && {
					additionalProperty: [
						suites && { "@type": "PropertyValue", name: "Suítes", value: suites },
						vagas && { "@type": "PropertyValue", name: "Vagas", value: vagas },
						preco && {
							"@type": "PropertyValue",
							name: "Preço",
							value: preco,
							unitText: "BRL",
						},
					].filter(Boolean),
				}),
			};
		})
		.filter(Boolean)
		.slice(0, 25);
}

/** Itens de lazer viram amenidades marcadas. */
export function amenidadesSchema(attributes) {
	if (!Array.isArray(attributes)) return [];
	return attributes
		.map((a) => semTags(a))
		.filter((a) => a.length > 1)
		.slice(0, 40)
		.map((nome) => ({
			"@type": "LocationFeatureSpecification",
			name: nome,
			value: true,
		}));
}

/** Identificador único do corretor, para as páginas se referirem à mesma pessoa. */
export const AUTOR_ID = () => `${getBaseUrl()}/#corretor`;

/** Quem responde pelo conteúdo das páginas. Igual em todo o site. */
export function autorPessoa() {
	return {
		"@type": "Person",
		"@id": AUTOR_ID(),
		name: contact.broker.name,
		jobTitle: "Corretor de imóveis",
		identifier: `CRECI-SP ${contact.broker.creci}`,
		worksFor: { "@type": "Organization", name: getSiteName(), url: getBaseUrl() },
		knowsAbout: [
			"Imóveis de alto padrão em São Paulo",
			"Lançamentos imobiliários",
			"Investimento em imóveis para renda",
		],
	};
}

/** FAQPage a partir de uma lista [{ q, a }]. Devolve null quando não há perguntas. */
export function faqPageSchema(url, perguntas) {
	const itens = (perguntas || []).filter((p) => p && p.q && p.a);
	if (itens.length === 0) return null;
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"@id": `${url}#faq`,
		mainEntity: itens.map((p) => ({
			"@type": "Question",
			name: semTags(p.q),
			acceptedAnswer: { "@type": "Answer", text: semTags(p.a) },
		})),
	};
}

/**
 * Nó de página com autoria e datas. `tipo` costuma ser CollectionPage
 * nas listagens e WebPage nas demais.
 */
export function paginaSchema({
	url,
	tipo = "WebPage",
	nome,
	descricao,
	modificadoEm = null,
	publicadoEm = null,
	imagem = null,
	entidadePrincipal = null,
}) {
	return {
		"@context": "https://schema.org",
		"@type": tipo,
		"@id": `${url}#pagina`,
		url,
		name: nome,
		...(descricao && { description: descricao }),
		inLanguage: "pt-BR",
		...(imagem && { primaryImageOfPage: imagem }),
		...(entidadePrincipal && { mainEntity: entidadePrincipal }),
		...(publicadoEm && { datePublished: publicadoEm }),
		...(modificadoEm && { dateModified: modificadoEm }),
		author: autorPessoa(),
		reviewedBy: { "@id": AUTOR_ID() },
		publisher: { "@type": "Organization", name: getSiteName(), url: getBaseUrl() },
	};
}

/** Data de modificação mais recente de uma lista de imóveis, em ISO. */
export function maisRecente(itens) {
	const datas = (itens || [])
		.map((i) => i && (i.updatedAt || i.createdAt))
		.filter(Boolean)
		.map((d) => new Date(d).getTime())
		.filter((t) => Number.isFinite(t));
	return datas.length ? new Date(Math.max(...datas)).toISOString() : null;
}

const brl = (v) =>
	new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
		maximumFractionDigits: 0,
	}).format(Number(v));

const metros = (m) =>
	m >= 1000
		? `${(m / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`
		: `${m} m`;

/**
 * Perguntas geradas a partir dos números do próprio imóvel: preço do m² contra a
 * mediana do bairro e distância do metrô. São as buscas de quem já está decidindo,
 * e nenhuma resposta aqui é opinião — tudo sai do banco.
 */
export function perguntasComparativas({ nome, analise, preco, area, entregaEm }) {
	if (!nome) return [];
	const perguntas = [];

	const mediana = Number(analise?.indice?.mediana) || 0;
	const bairro = analise?.indice?.bairro || null;
	const amostra = Number(analise?.indice?.n) || 0;
	const precoM2 = preco > 0 && area > 0 ? preco / area : 0;

	if (precoM2 > 0 && mediana > 0 && bairro) {
		const dif = Math.round(((precoM2 - mediana) / mediana) * 100);
		const comoEsta =
			dif <= -5
				? `${Math.abs(dif)}% abaixo`
				: dif >= 5
					? `${dif}% acima`
					: "praticamente na média";
		perguntas.push({
			q: `O ${nome} está caro ou barato para ${bairro}?`,
			a:
				`A menor unidade do ${nome} sai a ${brl(precoM2)} o m². A mediana de imóveis novos ` +
				`em ${bairro} é de ${brl(mediana)} o m², calculada sobre ${amostra} ` +
				`${amostra === 1 ? "empreendimento" : "empreendimentos"} que acompanhamos. ` +
				`O ${nome} está ${comoEsta}${dif <= -5 || dif >= 5 ? " dessa mediana" : ""}. ` +
				`Metragem, andar e acabamento explicam boa parte da diferença, então vale comparar unidades semelhantes.`,
		});
	}

	if (analise?.metro?.nome && analise.metro.dist) {
		const d = analise.metro.dist;
		const caminhada = Math.max(1, Math.round(d / 80));
		perguntas.push({
			q: `O ${nome} fica perto do metrô?`,
			a:
				`A estação mais próxima é o ${analise.metro.nome}, a ${metros(d)} em linha reta, ` +
				`cerca de ${caminhada} minutos a pé. ` +
				(d <= 800
					? "É uma distância curta, que costuma pesar no preço de revenda e na procura por locação."
					: d <= 1500
						? "É uma caminhada média; muita gente prefere ir de carro ou por aplicativo nos dias de chuva."
						: "Não é uma distância de caminhada no dia a dia, então considere carro ou aplicativo."),
		});
	}

	const polos = Array.isArray(analise?.polos) ? analise.polos.slice(0, 3) : [];
	if (polos.length > 0) {
		perguntas.push({
			q: `O que tem perto do ${nome}?`,
			a:
				`Os pontos de maior movimento no entorno são ` +
				polos
					.map((p) => `${p.nome}, a ${metros(p.dist)}`)
					.join("; ") +
				`. As distâncias são em linha reta, a partir do endereço do empreendimento.`,
		});
	}

	if (entregaEm) {
		perguntas.push({
			q: `Quando o ${nome} fica pronto?`,
			a: `A previsão de entrega informada pela incorporadora é ${entregaEm}. Prazos de obra podem mudar, e a data vale como referência da tabela mais recente.`,
		});
	}

	return perguntas;
}

/** Nome do empreendimento sem o sufixo da incorporadora. */
export function nomeSemIncorporadora(nome, dev) {
	const bruto = String(nome || "").trim();
	if (!dev) return bruto;
	const limpo = bruto
		// aceita "Nome - Tegra" e também "Nome - Tegra/Exto"
		.replace(
			new RegExp(
				`\\s*[-–—|]\\s*${dev.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^-–—|]*$`,
				"i",
			),
			"",
		)
		.trim();
	return limpo || bruto;
}

/**
 * Título da página de imóvel. O Google corta por volta de 60 caracteres, então
 * entram primeiro a metragem e os dormitórios — o que a pessoa digita na busca.
 * A marca fica de fora quando o espaço rende mais com dado: o nome do site já
 * aparece sozinho no resultado, acima do título.
 */
export function tituloImovel({ nome, dev, area, dorms, bairro, site }) {
	const base = nomeSemIncorporadora(nome, dev) || "Imóvel";
	const temBairro =
		bairro && base.toLowerCase().includes(String(bairro).toLowerCase());
	const ondeFica = !temBairro && bairro ? ` em ${bairro}` : "";

	const comArea = area ? `${base} — ${area}` : base;
	const comDorms = dorms ? `${comArea}, ${dorms}` : comArea;

	// Da versão mais informativa para a mais enxuta, sempre dentro do limite.
	const opcoes = [
		comDorms + ondeFica,
		comArea + ondeFica,
		comDorms,
		comArea,
	];
	for (const t of opcoes) if (t.length <= 60) return site && t.length + site.length + 3 <= 60 ? `${t} | ${site}` : t;
	return comArea.length <= 65 ? comArea : base;
}
