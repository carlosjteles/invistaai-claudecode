// Perguntas frequentes do site (alto padrão em São Paulo).
// Valores legais e de mercado conferidos em novembro de 2026; revise quando mudarem
// (teto do SFH, alíquota do ITBI, regras do FGTS).

export const titles = [
	{ title: "Compra na planta", to: "compra-na-planta" },
	{ title: "Financiamento e custos", to: "financiamento-e-custos" },
	{ title: "Investimento", to: "investimento" },
	{ title: "Compradores de fora", to: "compradores-de-fora" },
	{ title: "Atendimento InvistaAí", to: "atendimento" },
];

const t = (value) => ({ type: "text", value });
const l = (...items) => ({ type: "list", items: items.map((value) => ({ value })) });

export const data = [
	{
		sectionId: "compra-na-planta",
		sectionTitle: "Compra na planta",
		contents: [
			{
				id: 1,
				title: "Como funciona a compra de um imóvel na planta?",
				content: [
					t(
						"Você compra a unidade antes ou durante a obra, direto da incorporadora, e paga em etapas até a entrega das chaves. Em geral, o preço na planta é menor do que o de um imóvel pronto equivalente, e o comprador pode escolher andar, posição e, em alguns projetos, personalizar a planta."
					),
				],
			},
			{
				id: 2,
				title: "Como é o fluxo de pagamento até as chaves?",
				content: [
					t("Cada incorporadora define o seu fluxo, mas ele costuma combinar:"),
					l(
						"<strong>Entrada (sinal)</strong> na assinatura do contrato.",
						"<strong>Parcelas mensais</strong> durante a obra.",
						"<strong>Parcelas intermediárias (balões)</strong>, por exemplo semestrais ou anuais.",
						"<strong>Parcela das chaves</strong>, paga na entrega com recursos próprios ou com financiamento bancário."
					),
					t(
						"Antes de fechar, pedimos à incorporadora a tabela e o fluxo atualizados da unidade que você escolheu."
					),
				],
			},
			{
				id: 3,
				title: "As parcelas são corrigidas durante a obra?",
				content: [
					t(
						"Sim. Até a entrega das chaves, o saldo costuma ser corrigido pelo INCC (Índice Nacional de Custo da Construção). Depois das chaves, o saldo financiado direto com a incorporadora normalmente passa a ser corrigido por outro índice, como o IPCA, mais juros. As regras exatas estão no contrato de cada empreendimento."
					),
				],
			},
			{
				id: 4,
				title: "O que é patrimônio de afetação?",
				content: [
					t(
						"É um regime em que o terreno, a obra e os recursos de um empreendimento ficam separados do patrimônio da incorporadora. Na prática, o dinheiro pago pelos compradores fica vinculado àquela obra, o que dá mais segurança em caso de problemas financeiros da empresa. Vale conferir no memorial de incorporação se o empreendimento tem afetação."
					),
				],
			},
			{
				id: 5,
				title: "E se eu desistir da compra (distrato)?",
				content: [
					t(
						"A Lei 13.786/2018 regula o distrato de imóveis na planta. Em empreendimentos com patrimônio de afetação, a incorporadora pode reter até 50% do valor pago; sem afetação, até 25%, além da comissão de corretagem. Por isso, vale planejar bem o fluxo antes de assinar."
					),
				],
			},
		],
	},
	{
		sectionId: "financiamento-e-custos",
		sectionTitle: "Financiamento e custos",
		contents: [
			{
				id: 6,
				title: "Dá para financiar um imóvel de alto padrão?",
				content: [
					t(
						"Sim. Imóveis até o teto do Sistema Financeiro da Habitação (SFH), hoje de R$ 2,25 milhões, podem ser financiados pelo SFH, que tem juros limitados e permite usar o FGTS. Acima desse valor, o financiamento é pelo Sistema de Financiamento Imobiliário (SFI), com taxas negociadas com o banco. Em lançamentos, o financiamento costuma entrar na parcela das chaves."
					),
				],
			},
			{
				id: 7,
				title: "Posso usar o FGTS?",
				content: [
					t(
						"Pode, se o imóvel estiver dentro do teto do SFH (R$ 2,25 milhões) e você cumprir as regras do FGTS, como ter pelo menos 3 anos de trabalho com carteira assinada (somando todos os períodos) e não ter outro imóvel residencial na mesma cidade em que mora ou trabalha. O banco confirma as condições na análise de crédito."
					),
				],
			},
			{
				id: 8,
				title: "Quais custos existem além do preço do imóvel?",
				content: [
					l(
						"<strong>ITBI:</strong> imposto municipal de transmissão. Na cidade de São Paulo, a alíquota é de 3% sobre o valor da compra (ou o valor de referência da prefeitura, se for maior).",
						"<strong>Escritura e registro:</strong> taxas de cartório, que seguem a tabela do estado.",
						"<strong>Custos do financiamento:</strong> avaliação do imóvel e tarifas do banco, quando houver.",
						"<strong>Condomínio e IPTU:</strong> passam a ser do comprador a partir da entrega das chaves."
					),
					t(
						"Como referência, separe algo em torno de 4% a 5% do valor do imóvel para impostos e cartório. Ajudamos você a calcular o valor exato do seu caso."
					),
				],
			},
		],
	},
	{
		sectionId: "investimento",
		sectionTitle: "Investimento",
		contents: [
			{
				id: 9,
				title: "Imóvel de alto padrão é um bom investimento?",
				content: [
					t(
						"Depende principalmente da localização, do projeto e do preço de entrada. Bairros consolidados, como Jardins, Itaim Bibi, Vila Nova Conceição e Moema, costumam ter demanda constante de compra e locação. Comprar na planta pode trazer ganho de valorização até a entrega, mas não existe garantia de rentabilidade: cada caso precisa ser analisado."
					),
				],
			},
			{
				id: 10,
				title: "Como saber se o preço de um imóvel está justo?",
				content: [
					t(
						'Compare o preço por m² com o de outros imóveis novos do mesmo bairro. No nosso <a href="/indice-preco-m2"><strong>Índice de preço do m²</strong></a> você vê a mediana de cada bairro, atualizada diariamente, e no <a href="/comparar"><strong>comparador</strong></a> coloca até três empreendimentos lado a lado.'
					),
				],
			},
			{
				id: 11,
				title: "Vale comprar para alugar?",
				content: [
					t(
						"Pode valer, principalmente perto de polos de trabalho, metrô e serviços. Na análise, considere o aluguel provável da região, o condomínio, o IPTU, o tempo de vacância e o imposto sobre o aluguel. Se o objetivo é renda, conte para a nossa equipe que montamos um comparativo com os números de cada opção."
					),
				],
			},
		],
	},
	{
		sectionId: "compradores-de-fora",
		sectionTitle: "Compradores de fora",
		contents: [
			{
				id: 12,
				title: "Estrangeiros podem comprar imóvel em São Paulo?",
				content: [
					t(
						"Sim. Estrangeiros podem comprar imóveis urbanos no Brasil. É preciso ter CPF, que pode ser solicitado inclusive em consulados brasileiros no exterior, e o dinheiro vindo de fora deve entrar por uma operação de câmbio registrada em banco."
					),
				],
			},
			{
				id: 13,
				title: "Moro fora de São Paulo ou do Brasil. Consigo comprar a distância?",
				content: [
					t(
						"Consegue. A escolha pode ser feita com vídeos, plantas e visitas guiadas por chamada, e os documentos podem ser assinados digitalmente ou por procurador. Acompanhamos todas as etapas e enviamos as informações atualizadas de cada empreendimento."
					),
				],
			},
		],
	},
	{
		sectionId: "atendimento",
		sectionTitle: "Atendimento InvistaAí",
		contents: [
			{
				id: 14,
				title: "Como a InvistaAí trabalha?",
				content: [
					t(
						"Selecionamos lançamentos e imóveis prontos de alto padrão das principais incorporadoras de São Paulo e acompanhamos você da escolha à entrega das chaves: visita ao decorado, negociação, simulação de crédito e documentação. O atendimento é feito por corretor credenciado no CRECI."
					),
				],
			},
			{
				id: 15,
				title: "Os preços do site estão atualizados?",
				content: [
					t(
						"Os preços, as plantas, o estágio da obra e a previsão de entrega são atualizados toda semana a partir das tabelas das incorporadoras. Mesmo assim, os valores mudam com frequência e dependem da disponibilidade de cada unidade, por isso confirme sempre com a nossa equipe antes de decidir."
					),
				],
			},
			{
				id: 16,
				title: "Como falo com a equipe?",
				content: [
					t(
						'Pelo WhatsApp, em qualquer página de imóvel, ou pela página de <a href="/contato"><strong>contato</strong></a>. Respondemos com a tabela atualizada, as plantas e as condições de pagamento do empreendimento que você escolher.'
					),
				],
			},
		],
	},
];
