import React from "react";
import Link from "next/link";

export default function getInTouch() {
	return (
		<div className="row justify-content-center">
			<div className="col-12">
				<div className="section-title text-center">
					<h4 className="title mb-3">Tem dúvidas? Fale com a gente</h4>
					<p className="text-muted para-desc mb-0 mx-auto">
						Quer investir melhor ou conquistar seu primeiro imóvel? Estamos
						prontos para ajudar.
					</p>
					<div className="mt-4 pt-2">
						<Link href="/contato" className="btn btn-pills btn-primary">
							Fale com um consultor{" "}
							<i className="mdi mdi-arrow-right align-middle"></i>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
