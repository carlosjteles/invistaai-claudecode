"use client";

import React, { useState } from "react";
import { Link as Link2 } from "react-scroll";
import FaqTabContent from "./faqTabContent";
import { BsDot } from "../assets/icons/vander";

export default function FaqTab() {
	let [activeIndex, setActiveIndex] = useState(1);
	let [activeIndex1, setActiveIndex1] = useState(1);
	let [activeIndex2, setActiveIndex2] = useState(1);
	let [activeIndex3, setActiveIndex3] = useState(1);
	let [activeIndex4, setActiveIndex4] = useState(1);

	let faqTitles = [
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

	return (
		<div className="row justify-content-center">
			<div className="col-lg-4 col-md-5 col-12 d-none d-md-block">
				<div className="rounded-3 shadow p-4 sticky-bar">
					<ul className="list-unstyled sidebar-nav mb-0 py-0" id="navmenu-nav">
						{faqTitles.map(({ title, to }, index) => {
							return (
								<li
									className={`navbar-item p-0 ${index > 0 ? "ms-0 mt-3" : ""}`}
									key={index}
								>
									<Link2
										to={to}
										spy={true}
										activeclassname="active"
										smooth={true}
										offset={-100}
										duration={500}
										className="h6 text-dark navbar-link"
									>
										{title}
									</Link2>
								</li>
							);
						})}
					</ul>
				</div>
			</div>

			<div className="col-lg-8 col-md-7 col-12">
				<div id="housing-programs">
					<div className="section-title">
						<h4>Programas Habitacionais (MCMV)</h4>
					</div>

					<div className="accordion mt-4 pt-2" id="buyingquestion">
						<FaqTabContent
							id={1}
							title="O que é o Minha Casa, Minha Vida?"
							activeIndex={activeIndex}
							setActiveIndex={setActiveIndex}
						>
							Programa federal que facilita comprar, construir ou reformar a
							casa própria com juros reduzidos e possibilidade de subsídio, para
							famílias de baixa e média renda em áreas urbanas e rurais.
						</FaqTabContent>

						<FaqTabContent
							id={2}
							title="Quem pode participar?"
							activeIndex={activeIndex}
							setActiveIndex={setActiveIndex}
						>
							<ul className="list-unstyled text-muted mb-2">
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									<strong>Áreas urbanas:</strong> renda familiar até R$ 8 mil
									(ou até R$ 12 mil na Faixa 4).
								</li>
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									<strong>Áreas rurais:</strong> renda anual até R$ 96 mil.
								</li>
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									<strong>Parcela:</strong> não deve superar 30% da renda.
								</li>
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									<strong>Benefícios sociais:</strong> não entram no cálculo da
									renda (ex.: Bolsa Família).
								</li>
							</ul>
						</FaqTabContent>

						<FaqTabContent
							id={3}
							title="Faixas de renda e limites de imóvel (urbano e rural)"
							activeIndex={activeIndex}
							setActiveIndex={setActiveIndex}
						>
							<h5 className="text-dark h5 mb-0">Urbanas</h5>
							<ul className="list-unstyled text-muted mb-3">
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									<strong>Faixa 1:</strong> até R$ 2.850 — imóvel até R$ 190
									mil.
								</li>
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									<strong>Faixa 2:</strong> R$ 2.850 a R$ 4.700 — imóvel até R$
									264 mil.
								</li>
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									<strong>Faixa 3:</strong> R$ 4.700 a R$ 8.000 — imóvel até R$
									350 mil.
								</li>
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									<strong>Faixa 4:</strong> R$ 8.000 a R$ 12.000 — imóvel até R$
									500 mil (sem subsídio).
								</li>
							</ul>

							<h5 className="text-dark h5 mb-0">Rurais</h5>
							<ul className="list-unstyled text-muted mb-2">
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									<strong>Faixa 1:</strong> até R$ 40 mil/ano — imóvel até R$ 75
									mil.
								</li>
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									<strong>Faixa 2:</strong> R$ 40.000 a R$ 66.600/ano.
								</li>
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									<strong>Faixa 3:</strong> R$ 66.600 a R$ 96.000/ano.
								</li>
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									<strong>Faixa 4:</strong> ainda sem definição.
								</li>
							</ul>
						</FaqTabContent>

						<FaqTabContent
							id={4}
							title="O que mudou em 2025?"
							activeIndex={activeIndex}
							setActiveIndex={setActiveIndex}
						>
							<ul className="list-unstyled text-muted mb-2">
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									<strong>Juros:</strong> Faixa 1 a partir de 4% a.a. (N/NE) e
									4,25% a.a. nas demais regiões.
								</li>
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									<strong>Subsídio:</strong> teto ampliado para até R$ 55 mil.
								</li>
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									<strong>Faixa 4:</strong> renda de R$ 8–12 mil, sem subsídio;
									imóvel até R$ 500 mil.
								</li>
							</ul>
						</FaqTabContent>

						<FaqTabContent
							id={5}
							title="Prioridades e vedações"
							activeIndex={activeIndex}
							setActiveIndex={setActiveIndex}
						>
							<h5 className="text-dark h5 mb-0">Prioridade</h5>
							<ul className="list-unstyled text-muted mb-3">
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									Famílias chefiadas por mulheres.
								</li>
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									Famílias com idosos, crianças ou pessoas com deficiência.
								</li>
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									Moradores em áreas de risco/calamidade ou removidos por obras.
								</li>
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									Pessoas em situação de rua.
								</li>
							</ul>

							<h5 className="text-dark h5 mb-0">Vedações</h5>
							<ul className="list-unstyled text-muted mb-2">
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									Possuir imóvel ou financiamento ativo no SFH.
								</li>
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									Ter restrição de crédito (SPC/Serasa).
								</li>
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									Funcionário da Caixa ou cônjuge.
								</li>
								<li className="ms-0 mt-2">
									<BsDot className="fea icon-sm me-2" />
									Já ter sido beneficiado por outro programa habitacional.
								</li>
							</ul>
						</FaqTabContent>
					</div>
				</div>
			</div>
		</div>
	);
}
