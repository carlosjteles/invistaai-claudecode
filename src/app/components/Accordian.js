"use client";
import React from "react";

const accordianData = [
	{
		id: 1,
		title: "Preciso de conhecimento técnico para usar?",
		desc: "Não. Nossa plataforma é intuitiva e pensada para todos os níveis de experiência.",
	},
	{
		id: 2,
		title: "As informações dos imóveis são garantidas?",
		desc: "Trabalhamos para manter todas as informações precisas e atualizadas, mas recomendamos sempre verificar os detalhes durante a visita presencial ao imóvel.",
	},
];

export default function Accordion() {
	const [activeIndex, setActiveIndex] = React.useState(null);

	const toggleAccordion = (id) => {
		setActiveIndex(activeIndex === id ? null : id);
	};

	return (
		<>
			<div className="accordion mt-4 pt-2">
				{accordianData.map((item, index) => {
					return (
						<div
							className="accordion-item rounded-3 mb-3"
							key={index}
							itemScope
							itemType="https://schema.org/Question"
						>
							<h2 className="accordion-header" id="headingOne">
								<button
									className={`accordion-button border-0 bg-light ${
										activeIndex === item.id ? "active" : ""
									}`}
									onClick={() => toggleAccordion(item.id)}
								>
									<span itemProp="name">{item.title}</span>
								</button>
							</h2>
							{activeIndex === item.id && (
								<div
									id="collapseOne"
									className="accordion-collapse border-0"
									itemScope
									itemType="https://schema.org/Answer"
								>
									<div className="accordion-body text-muted" itemProp="text">
										{item.desc}
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</>
	);
}
