"use client";
import React from "react";

const accordianData = [
	{
		id: 1,
		title: "Preciso de conhecimento técnico para usar?",
		desc: "Não. Nossa plataforma é intuitiva e pensada para todos os níveis de experiência.",
	},
];

export default function Accordion() {
	const [activeIndex, setActiveIndex] = React.useState(1);

	return (
		<>
			<div className="accordion mt-4 pt-2" id="buyingquestion">
				{accordianData.map((item, index) => {
					return (
						<div className="accordion-item rounded-3 mb-3" key={index}>
							<h2 className="accordion-header" id="headingOne">
								<button
									className={`accordion-button border-0 bg-light ${
										activeIndex === item.id ? "active" : ""
									}`}
									onClick={() => setActiveIndex(item.id)}
								>
									{item.title}
								</button>
							</h2>
							{activeIndex === item.id && (
								<div id="collapseOne" className="accordion-collapse border-0">
									<div className="accordion-body text-muted">{item.desc}</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</>
	);
}
