"use client";
import CountUp from "react-countup";

const data = [
	{
		end: 1548,
		suffix: "+",
		separator: ".",
		label: "Oportunidades analisadas",
	},
	{
		end: 20,
		suffix: "+",
		label: "Parcerias estratégicas",
	},
	{
		end: 9,
		suffix: "+",
		label: "Indicadores monitorados",
	},
	{
		end: 95,
		suffix: "%",
		label: "Satisfação dos clientes",
	},
];

export default function AboutCounter() {
	return (
		<div className="row">
			{data.map((counter, idx) => (
				<div className="col-3 py-3" key={idx}>
					<div className="counter-box text-center">
						<h1 className="mb-0 fw-semibold">
							<CountUp
								start={0}
								end={counter.end}
								separator={counter.separator}
								className="counter-value"
							/>
							{counter.suffix}
						</h1>
						<h6 className="counter-head text-muted fw-normal">
							{counter.label}
						</h6>
					</div>
				</div>
			))}
		</div>
	);
}
