import Link from "next/link";

import {
	FiHexagon,
	TbHomeSearch,
	FiUsers,
	HiOutlineDocumentCheck,
} from "../assets/icons/vander";

const data = [
	{
		icon: TbHomeSearch,
		title: "Avaliação & Curadoria",
		desc: "Dados de mercado, due diligence e análise de risco-retorno para selecionar oportunidades com potencial real.",
	},
	{
		icon: FiUsers,
		title: "Encontro com o Consultor",
		desc: "Entendimento do seu perfil (moradia, renda, valorização) e apresentação de opções alinhadas ao seu orçamento.",
	},
	{
		icon: HiOutlineDocumentCheck,
		title: "Fechamento com Segurança",
		desc: "Apoio em documentação, financiamento e prazos até a assinatura do contrato — com previsibilidade.",
	},
];

export default function AboutUs() {
	return (
		<>
			<div className="row justify-content-center">
				<div className="col">
					<div className="section-title text-center mb-4 pb-2">
						<h4 className="title mb-3">Como Funciona</h4>
						<p className="text-muted para-desc mb-0 mx-auto">
							A maneira mais rápida e segura de investir em studios e
							apartamentos compactos.
						</p>
					</div>
				</div>
			</div>

			<div className="row g-4 mt-0">
				{data.map((item, index) => {
					let Icon = item.icon;
					return (
						<div className="col-md-4" key={index}>
							<div className="position-relative features text-center mx-lg-4 px-md-1">
								<div className="feature-icon position-relative overflow-hidden d-flex justify-content-center">
									<FiHexagon className="hexagon" />
									<div className="position-absolute top-50 start-50 translate-middle">
										<Icon className="fea icon-m-md text-primary" />
									</div>
								</div>

								<div className="mt-4">
									<Link href="#" className="fw-medium title text-dark fs-5">
										{item.title}
									</Link>
									<p className="text-muted mt-3 mb-0">{item.desc}</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
}
