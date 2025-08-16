export const titles = [
	{
		title: "Programas Habitacionais",
		to: "housing-programs",
	},
	{
		title: "Condições e Benefícios",
		to: "conditions-and-benefits",
	},
	{
		title: "Tipos de Financiamento",
		to: "financing-types",
	},
	{
		title: "Comparativos e Dicas",
		to: "comparatives-and-tips",
	},
	{
		title: "IA Generativa na Construção",
		to: "generative-ai-in-construction",
	},
];

export const data = [
	{
		sectionId: "housing-programs",
		sectionTitle: "Programas Habitacionais (MCMV)",
		contents: [
			{
				id: 1,
				title: "O que é o Minha Casa, Minha Vida?",
				content: [
					{
						type: "text",
						value:
							"Programa federal que facilita comprar, construir ou reformar a casa própria com juros reduzidos e possibilidade de subsídio, para famílias de baixa e média renda em áreas urbanas e rurais.",
					},
				],
			},
			{
				id: 2,
				title: "Quem pode participar?",
				content: [
					{
						type: "list",
						items: [
							{
								value:
									"<strong>Áreas urbanas:</strong> renda familiar até R$ 8 mil (ou até R$ 12 mil na Faixa 4).",
							},
							{
								value:
									"<strong>Áreas rurais:</strong> renda anual até R$ 96 mil.",
							},
							{
								value:
									"<strong>Parcela:</strong> não deve superar 30% da renda.",
							},
							{
								value:
									"<strong>Benefícios sociais:</strong> não entram no cálculo da renda (ex.: Bolsa Família).",
							},
						],
					},
				],
			},
			{
				id: 3,
				title: "Faixas de renda e limites de imóvel (urbano e rural)",
				content: [
					{ type: "subtitle", value: "Urbanas" },
					{
						type: "list",
						items: [
							{
								value:
									"<strong>Faixa 1:</strong> até R$ 2.850 — imóvel até R$ 190 mil.",
							},
							{
								value:
									"<strong>Faixa 2:</strong> R$ 2.850 a R$ 4.700 — imóvel até R$ 264 mil.",
							},
							{
								value:
									"<strong>Faixa 3:</strong> R$ 4.700 a R$ 8.000 — imóvel até R$ 350 mil.",
							},
							{
								value:
									"<strong>Faixa 4:</strong> R$ 8.000 a R$ 12.000 — imóvel até R$ 500 mil (sem subsídio).",
							},
						],
					},
					{ type: "subtitle", value: "Rurais" },
					{
						type: "list",
						items: [
							{
								value:
									"<strong>Faixa 1:</strong> até R$ 40 mil/ano — imóvel até R$ 75 mil.",
							},
							{
								value: "<strong>Faixa 2:</strong> R$ 40.000 a R$ 66.600/ano.",
							},
							{
								value: "<strong>Faixa 3:</strong> R$ 66.600 a R$ 96.000/ano.",
							},
							{ value: "<strong>Faixa 4:</strong> ainda sem definição." },
						],
					},
				],
			},
			{
				id: 4,
				title: "O que mudou em 2025?",
				content: [
					{
						type: "list",
						items: [
							{
								value:
									"<strong>Juros:</strong> Faixa 1 a partir de 4% a.a. (N/NE) e 4,25% a.a. nas demais regiões.",
							},
							{
								value:
									"<strong>Subsídio:</strong> teto ampliado para até R$ 55 mil.",
							},
							{
								value:
									"<strong>Faixa 4:</strong> renda de R$ 8–12 mil, sem subsídio; imóvel até R$ 500 mil.",
							},
						],
					},
				],
			},
			{
				id: 5,
				title: "Prioridades e vedações",
				content: [
					{ type: "subtitle", value: "Prioridade" },
					{
						type: "list",
						items: [
							{ value: "Famílias chefiadas por mulheres." },
							{
								value:
									"Famílias com idosos, crianças ou pessoas com deficiência.",
							},
							{
								value:
									"Moradores em áreas de risco/calamidade ou removidos por obras.",
							},
							{ value: "Pessoas em situação de rua." },
						],
					},
					{ type: "subtitle", value: "Vedações" },
					{
						type: "list",
						items: [
							{ value: "Possuir imóvel ou financiamento ativo no SFH." },
							{ value: "Ter restrição de crédito (SPC/Serasa)." },
							{ value: "Funcionário da Caixa ou cônjuge." },
							{
								value:
									"Já ter sido beneficiado por outro programa habitacional.",
							},
						],
					},
				],
			},
		],
	},
	{
		sectionId: "conditions-and-benefits",
		sectionTitle: "Condições e Benefícios",
		contents: [
			{
				id: 1,
				title: "Como funcionam os juros no MCMV?",
				content: [
					{
						type: "list",
						items: [
							{
								value:
									"<strong>Faixa 1:</strong> a partir de 4% a.a. (N/NE) e 4,25% a.a. (demais).",
							},
							{ value: "<strong>Faixa 2:</strong> até 7% a.a." },
							{ value: "<strong>Faixa 3:</strong> até 8,16% a.a." },
							{ value: "<strong>Faixa 4:</strong> até 10,5% a.a." },
						],
					},
				],
			},
			{
				id: 2,
				title: "Como funciona o subsídio?",
				content: [
					{
						type: "list",
						items: [
							{ value: "Reduz o valor financiado e pode compor a entrada." },
							{
								value:
									"<strong>Faixa 1:</strong> até 95% do valor do imóvel (limites: R$ 190 mil urbano / R$ 75 mil rural).",
							},
							{ value: "FGTS nas Faixas 1 e 2: subsídio até R$ 55 mil." },
							{ value: "<strong>Faixas 3 e 4:</strong> não recebem subsídio." },
						],
					},
				],
			},
			{
				id: 3,
				title: "Posso usar FGTS?",
				content: [
					{
						type: "list",
						items: [
							{ value: "36 meses de contribuição ao FGTS." },
							{ value: "Sem financiamento ativo no SFH." },
							{
								value:
									"Sem uso do FGTS para compra/amortização nos últimos 5 anos.",
							},
						],
					},
				],
			},
			{
				id: 4,
				title: "Documentos e passo a passo",
				content: [
					{ type: "subtitle", value: "Documentos" },
					{
						type: "list",
						items: [
							{ value: "RG, CPF, carteira de trabalho." },
							{ value: "Comprovantes de renda, residência, estado civil." },
							{
								value:
									"Título de eleitor; docs de filhos; laudo PCD (se houver).",
							},
						],
					},
					{ type: "subtitle", value: "Fluxo" },
					{
						type: "list",
						items: [
							{
								value:
									"<strong>Faixa 1:</strong> cadastro na prefeitura/entidade.",
							},
							{
								value:
									"<strong>Faixas 2–4:</strong> escolher imóvel, simular na Caixa, levar docs.",
							},
							{
								value:
									"Análise (até 30 dias) → contrato → construção (se aplicável) → chaves.",
							},
						],
					},
				],
			},
		],
	},
	{
		sectionId: "financing-types",
		sectionTitle: "Tipos de Financiamento (SFH/SFI)",
		contents: [
			{
				id: 1,
				title: "O que é o SFH?",
				content: [
					{
						type: "text",
						value:
							"Sistema de 1964 que usa recursos do FGTS e da poupança (SBPE) para baratear o crédito imobiliário. Regras e limites definidos em lei.",
					},
				],
			},
			{
				id: 2,
				title: "Quem pode usar o SFH?",
				content: [
					{
						type: "list",
						items: [
							{ value: "Mínimo 3 anos de FGTS." },
							{ value: "Sem outro financiamento no SFH." },
							{ value: "Não possuir imóvel urbano." },
							{ value: "Imóvel até R$ 1,5 milhão." },
							{ value: "Financiamento de até 80% do valor." },
							{ value: "Morar/trabalhar na cidade há ≥ 1 ano." },
							{ value: "Sem uso do FGTS nos últimos 3 anos." },
						],
					},
				],
			},
			{
				id: 3,
				title: "O que é o SFI?",
				content: [
					{
						type: "text",
						value:
							"Abrange casos fora do SFH (imóveis > R$ 1,5 mi, quem já possui imóvel, etc.). Regras flexíveis, pode financiar 100%, recursos de bancos/investidores. Hoje permite uso do FGTS.",
					},
				],
			},
			{
				id: 4,
				title: "Quem pode usar o SFI?",
				content: [
					{
						type: "list",
						items: [
							{ value: "Pode ter outros imóveis/financiamentos." },
							{ value: "Sem limite de valor do imóvel." },
							{
								value:
									"Sem exigência de tempo de FGTS (exceto para uso do FGTS).",
							},
						],
					},
				],
			},
			{
				id: 5,
				title: "SFH x SFI: diferenças",
				content: [
					{
						type: "list",
						items: [
							{
								value:
									"<strong>SFH:</strong> recursos FGTS/poupança; juros menores; limites e regras legais.",
							},
							{
								value:
									"<strong>SFI:</strong> recursos privados; juros maiores; flexibilidade (valor, percentual, múltiplos imóveis).",
							},
						],
					},
				],
			},
		],
	},
	{
		sectionId: "comparatives-and-tips",
		sectionTitle: "Comparativos e Dicas",
		contents: [
			{
				id: 1,
				title: "Vantagens e desvantagens (SFH)",
				content: [
					{ type: "subtitle", value: "Vantagens" },
					{
						type: "list",
						items: [
							{ value: "Juros menores." },
							{ value: "Uso do FGTS." },
							{
								value: "Liberação ágil.",
							},
						],
					},
					{ type: "subtitle", value: "Desvantagens" },
					{
						type: "list",
						items: [
							{
								value: "Teto de valor do imóvel.",
							},
							{
								value: "Não financia 100%.",
							},
							{
								value: "Regras rígidas do FGTS.",
							},
						],
					},
				],
			},
			{
				id: 2,
				title: "Vantagens e desvantagens (SFI)",
				content: [
					{ type: "subtitle", value: "Vantagens" },
					{
						type: "list",
						items: [
							{ value: "Pode ter mais de um imóvel." },
							{ value: "Serve para residencial e comercial." },
							{
								value: "Sem tetos rígidos; aceita FGTS.",
							},
						],
					},
					{ type: "subtitle", value: "Desvantagens" },
					{
						type: "list",
						items: [
							{
								value: "Juros geralmente mais altos.",
							},
						],
					},
				],
			},
			{
				id: 3,
				title: "Como escolher a melhor opção?",
				content: [
					{
						type: "list",
						items: [
							{ value: "Compare juros e CET." },
							{ value: "Cheque limites e percentual financiável." },
							{
								value: "Simule em diferentes bancos.",
							},
							{
								value: "Avalie prazo, parcela e amortização.",
							},
							{
								value: "No SFH, mantenha parcela até 30% da renda.",
							},
						],
					},
				],
			},
			{
				id: 4,
				title: "Como conseguir melhores condições?",
				content: [
					{
						type: "list",
						items: [
							{ value: "Mantenha score alto e Cadastro Positivo." },
							{ value: "CPF regular e bom histórico com o banco." },
							{
								value: "Organização financeira e comprovação de renda.",
							},
						],
					},
				],
			},
		],
	},
	{
		sectionId: "generative-ai-in-construction",
		sectionTitle: "IA Generativa na Construção",
		contents: [
			{
				id: 1,
				title: "O que é IA generativa?",
				content: [
					{
						type: "text",
						value:
							"Diferente da IA tradicional (que analisa dados e prevê com base em padrões), a IA generativa <strong>cria novas soluções</strong> a partir dos dados e das instruções recebidas. Na construção, ela permite simular cenários, ajustar cronogramas, sugerir materiais, redefinir layouts e muito mais.",
					},
				],
			},
			{
				id: 2,
				title: "Como a IA generativa funciona na construção?",
				content: [
					{
						type: "list",
						items: [
							{
								value:
									"Gera projetos com base em preferências do cliente, tipo de terreno, zoneamento e orçamento.",
							},
							{
								value:
									"Realiza simulações 3D com detalhes estruturais e visuais.",
							},
							{
								value:
									"Analisa sensores/imagens do canteiro para alimentar o modelo com dados reais.",
							},
							{
								value: "Cria cronogramas otimizados e os ajusta dinamicamente.",
							},
							{
								value:
									"Integra-se ao <strong>BIM</strong> para detectar conflitos entre disciplinas, ajustar materiais e prever custos.",
							},
						],
					},
				],
			},
			{
				id: 3,
				title: "Aplicações em obras e projetos",
				content: [
					{
						type: "list",
						items: [
							{
								value:
									"<strong>Geração automática de projetos e plantas:</strong> otimiza espaço, ventilação, iluminação e normas.",
							},
							{
								value:
									"<strong>Simulações e previsões de cronogramas:</strong> antecipa atrasos por clima, materiais ou equipes.",
							},
							{
								value:
									"<strong>Monitoramento por imagens/vídeos:</strong> drones e câmeras identificam falhas e riscos de segurança.",
							},
							{
								value:
									"<strong>Otimização de materiais:</strong> reduz desperdícios e sugere alternativas mais eficientes.",
							},
						],
					},
				],
			},
			{
				id: 4,
				title: "Benefícios para construtoras e profissionais",
				content: [
					{
						type: "list",
						items: [
							{
								value:
									"<strong>Projetos mais precisos e adaptáveis</strong> com menos retrabalho.",
							},
							{
								value:
									"<strong>Redução de custos</strong> por otimização de insumos e prevenção de falhas.",
							},
							{
								value:
									"<strong>Decisão ágil</strong> com dados em tempo real e gestão do canteiro mais eficiente.",
							},
							{
								value:
									"<strong>Melhor gestão de tempo</strong> com cronogramas dinâmicos.",
							},
							{
								value:
									"<strong>Mais segurança e qualidade</strong> via identificação de riscos e ações preventivas.",
							},
						],
					},
				],
			},
			{
				id: 5,
				title: "Desafios na adoção",
				content: [
					{
						type: "list",
						items: [
							{
								value:
									"<strong>Qualidade/integração de dados:</strong> bases confiáveis e atualizadas.",
							},
							{
								value:
									"<strong>Investimento em tecnologia:</strong> sistemas integrados, sensores e conectividade (compatíveis com BIM).",
							},
							{
								value:
									"<strong>Capacitação:</strong> treinar equipes para novas ferramentas e processos.",
							},
							{
								value:
									"<strong>Cibersegurança:</strong> proteger informações sensíveis de projetos e custos.",
							},
						],
					},
				],
			},
			{
				id: 6,
				title: "O futuro da IA generativa na construção",
				content: [
					{
						type: "list",
						items: [
							{
								value:
									"Projetos cada vez mais <strong>customizados</strong> e inteligentes.",
							},
							{
								value:
									"<strong>Integração</strong> com BIM, IoT, nuvem e sensores em um ecossistema de dados.",
							},
							{
								value:
									"<strong>Automação</strong> da gestão de obras e <strong>manutenção preditiva</strong>.",
							},
							{
								value:
									"<strong>Sustentabilidade:</strong> redução de emissões e melhor uso de recursos naturais.",
							},
							{
								value:
									"<strong>Construção 4.0:</strong> novo patamar de eficiência, qualidade e segurança.",
							},
						],
					},
				],
			},
			{
				id: 7,
				title: "Como começar?",
				content: [
					{
						type: "list",
						items: [
							{
								value:
									"Mapeie processos e maturidade digital; centralize os dados do projeto.",
							},
							{
								value:
									"Integre sistemas (BIM, planejamento, orçamento) e sensores do canteiro.",
							},
							{
								value: "Faça pilotos controlados e treine as equipes técnicas.",
							},
							{
								value:
									"Implemente governança de dados e políticas de segurança.",
							},
						],
					},
				],
			},
		],
	},
];
