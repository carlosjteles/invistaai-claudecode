export const bedrooms = [
	"Studio",
	"1 dormitório",
	"2 dormitórios",
	"3 dormitórios",
	"4+ dormitórios",
];

export const suites = [
	"0 suíte",
	"1 suíte",
	"2 suítes",
	"3 suítes",
	"4+ suítes",
];

export const parkingSpaces = [
	"0 vaga",
	"1 vaga",
	"2 vagas",
	"3 vagas",
	"4+ vagas",
];

export const prices = [
	{ value: "100000", label: "R$ 100.000,00" },
	{ value: "200000", label: "R$ 200.000,00" },
	{ value: "300000", label: "R$ 300.000,00" },
	{ value: "400000", label: "R$ 400.000,00" },
	{ value: "500000", label: "R$ 500.000,00" },
	{ value: "600000", label: "R$ 600.000,00" },
	{ value: "700000", label: "R$ 700.000,00" },
	{ value: "800000", label: "R$ 800.000,00" },
	{ value: "900000", label: "R$ 900.000,00" },
	{ value: "1000000", label: "R$ 1.000.000,00" },
	{ value: "5000000", label: "R$ 5.000.000,00" },
	{ value: "10000000", label: "R$ 10.000.000,00" },
];

export const categories = [
	{
		id: 1,
		label: "Breve Lançamento",
		image: "/images/categories/brief-launch.webp",
	},
	{
		id: 2,
		label: "Lançamento",
		image: "/images/categories/launch.webp",
	},
	{
		id: 3,
		label: "Em Construção",
		image: "/images/categories/under-construction.webp",
	},
	{
		id: 4,
		label: "Pronto Novo",
		image: "/images/categories/ready-new.webp",
	},
	{
		id: 5,
		label: "Investimento",
		image: "/images/categories/investment.webp",
	},
];

/** Fases usadas nos filtros: "Lançamento" inclui os de breve lançamento (categoria 1). */
export const fases = [
	{ id: 2, label: "Lançamento" },
	{ id: 3, label: "Em Construção" },
	{ id: 4, label: "Pronto Novo" },
];

/** Tipos de unidade (lidos das plantas de cada imóvel). "cobertura" e "investimento" são grupos. */
export const tiposUnidade = [
	{ value: "apartamento", label: "Apartamento" },
	{ value: "cobertura", label: "Coberturas e duplex (todas)" },
	{ value: "cobertura-duplex", label: "Cobertura duplex" },
	{ value: "cobertura-horizontal", label: "Cobertura horizontal" },
	{ value: "duplex", label: "Duplex / triplex" },
	{ value: "garden", label: "Garden" },
	{ value: "investimento", label: "Investimento (studio, loft e NR)" },
	{ value: "studio", label: "Studio" },
	{ value: "loft", label: "Loft" },
	{ value: "nr", label: "NR (não residencial)" },
];

export const TIPOS_GRUPO = {
	cobertura: ["Cobertura Duplex", "Cobertura Horizontal", "Duplex", "Triplex"],
	"cobertura-duplex": ["Cobertura Duplex"],
	"cobertura-horizontal": ["Cobertura Horizontal"],
	duplex: ["Duplex", "Triplex"],
	garden: ["Garden"],
	studio: ["Studio"],
	loft: ["Loft"],
	investimento: ["Studio", "Loft"],
};

/** Cartões da Home: 3 por fase + 2 por tipo de unidade. */
export const homeCards = [
	{ key: "lancamento", label: "Lançamentos", href: "/imoveis?categoria=2", categorias: [1, 2], image: "/images/categories/launch.webp" },
	{ key: "obra", label: "Em Construção", href: "/imoveis?categoria=3", categorias: [3], image: "/images/categories/under-construction.webp" },
	{ key: "pronto", label: "Prontos para Morar", href: "/imoveis?categoria=4", categorias: [4], image: "/images/categories/ready-new.webp" },
	{
		key: "cobertura",
		label: "Coberturas e Duplex",
		href: "/coberturas",
		tipo: "cobertura",
		image: "https://deolsoahklnyjahujmdh.supabase.co/storage/v1/object/public/media/images/property/85815/13.jpg",
	},
	{ key: "investimento", label: "Investimento e Renda", href: "/investimento", tipo: "investimento", image: "/images/categories/investment.webp" },
];
