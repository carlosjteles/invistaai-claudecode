import Link from "next/link";

export default function GetInTouch() {
	return (
		<div
			className="row justify-content-center"
			itemScope
			itemType="https://schema.org/ContactAction"
		>
			<div className="col-12">
				<div className="section-title text-center">
					<h4 className="title mb-3" itemProp="name">
						Tem dúvidas? Fale com a gente
					</h4>
					<p
						className="text-muted para-desc mb-0 mx-auto"
						itemProp="description"
					>
						Quer investir melhor ou conquistar seu primeiro imóvel? Estamos
						prontos para ajudar.
					</p>
					<div className="mt-4 pt-2">
						<Link
							href="/contato"
							className="btn btn-pills btn-primary"
							itemProp="url"
						>
							<span itemProp="actionOption">Fale com um consultor</span>{" "}
							<i className="mdi mdi-arrow-right align-middle"></i>
						</Link>
					</div>
				</div>
			</div>

			<meta
				itemProp="availableChannel"
				content="https://schema.org/ContactPage"
			/>
			<meta itemProp="serviceType" content="Consultoria Imobiliária" />
		</div>
	);
}
