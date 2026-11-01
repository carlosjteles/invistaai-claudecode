import Link from "next/link";

import { getSiteName } from "../helper/utils";

export default function GetInTouch() {
	return (
		<div
			className="row justify-content-center"
			itemScope
			itemType="https://schema.org/Organization"
		>
			<div className="col-12">
				<div className="section-title text-center">
					<h2 className="title h4 mb-3" itemProp="name">
						Tem dúvidas? Fale com a gente
					</h2>
					<p
						className="text-muted para-desc mb-0 mx-auto"
						itemProp="description"
					>
						Quer investir melhor ou conquistar seu primeiro imóvel? Estamos
						prontos para ajudar.
					</p>
					<div
						className="mt-4 pt-2"
						itemProp="contactPoint"
						itemScope
						itemType="https://schema.org/ContactPoint"
					>
						<meta itemProp="contactType" content="Consultoria" />
						<Link
							href="/contato"
							className="btn btn-pills btn-primary"
							itemProp="url"
						>
							Fale com um consultor{" "}
							<i
								className="mdi mdi-arrow-right align-middle"
								aria-hidden="true"
							></i>
						</Link>
					</div>
				</div>
			</div>

			<meta itemProp="name" content={getSiteName()} />
		</div>
	);
}
