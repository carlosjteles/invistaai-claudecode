"use client";
import React from "react";

import CountUp from "react-countup";

export default function AboutCounter() {
	return (
		<>
			<div className="row">
				<div className="col-3 py-3">
					<div className="counter-box text-center">
						<h1 className="mb-0 fw-semibold">
							<CountUp
								start={0}
								end={1548}
								separator="."
								className="counter-value"
							/>
							+
						</h1>
						<h6 className="counter-head text-muted fw-normal">
							Oportunidades analisadas
						</h6>
					</div>
				</div>

				<div className="col-3 py-3">
					<div className="counter-box text-center">
						<h1 className="mb-0 fw-semibold">
							<CountUp start={0} end={20} className="counter-value" />+
						</h1>
						<h6 className="counter-head text-muted fw-normal">
							Parcerias estratégicas
						</h6>
					</div>
				</div>

				<div className="col-3 py-3">
					<div className="counter-box text-center">
						<h1 className="mb-0 fw-semibold">
							<CountUp start={0} end={9} className="counter-value" />+
						</h1>
						<h6 className="counter-head text-muted fw-normal">
							Indicadores monitorados
						</h6>
					</div>
				</div>

				<div className="col-3 py-3">
					<div className="counter-box text-center">
						<h1 className="mb-0 fw-semibold">
							<CountUp start={0} end={95} className="counter-value" />%
						</h1>
						<h6 className="counter-head text-muted fw-normal">
							Satisfação dos clientes
						</h6>
					</div>
				</div>
			</div>
		</>
	);
}
