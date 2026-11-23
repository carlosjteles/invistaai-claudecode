"use client";
import React from "react";

const brl = (v) =>
	new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(
		Math.max(0, Math.round(v))
	);
const num = (v, min, max) => {
	const n = Number(String(v).replace(",", "."));
	return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
};

/** Meses entre hoje e a data de entrega "dd/mm/aaaa" (0 se já entregue ou sem data). */
const mesesAte = (data) => {
	const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data || "");
	if (!m) return 0;
	const hoje = new Date();
	return Math.max(0, (Number(m[3]) - hoje.getFullYear()) * 12 + (Number(m[2]) - 1 - hoje.getMonth()));
};

function Campo({ id, rotulo, sufixo, valor, onChange, min = 0, max = 100, step = 1, ajuda }) {
	return (
		<div className="col-6">
			<label htmlFor={id} className="form-label small text-muted mb-1">
				{rotulo}
			</label>
			<div className="input-group input-group-sm">
				<input
					id={id}
					type="number"
					inputMode="decimal"
					className="form-control"
					min={min}
					max={max}
					step={step}
					value={valor}
					onChange={(e) => onChange(e.target.value)}
				/>
				<span className="input-group-text">{sufixo}</span>
			</div>
			{ajuda && <div className="form-text small mt-1">{ajuda}</div>}
		</div>
	);
}

/**
 * Simulador do fluxo de pagamento de um lançamento: entrada, mensais durante a obra,
 * balões anuais e parcela das chaves, com o financiamento bancário das chaves (SAC).
 */
export default function PaymentSimulator({ name, price, typelogies = [], deliveryIn, category, phone }) {
	const unidades = React.useMemo(
		() =>
			(Array.isArray(typelogies) ? typelogies : [])
				.filter((t) => Number(t?.price) > 0)
				.sort((a, b) => a.price - b.price)
				.map((t) => ({
					preco: Number(t.price),
					rotulo: [
						t.private_area ? `${Math.round(t.private_area)} m²` : null,
						t.suites ? `${t.suites} ${t.suites > 1 ? "suítes" : "suíte"}` : null,
						t.parking ? `${t.parking} ${t.parking > 1 ? "vagas" : "vaga"}` : null,
					]
						.filter(Boolean)
						.join(" · "),
				})),
		[typelogies]
	);

	const meses = category === 4 ? 0 : mesesAte(deliveryIn);
	const naPlanta = meses >= 2;
	const anuais = naPlanta ? Math.floor(meses / 12) : 0;

	const [unidade, setUnidade] = React.useState(0);
	const [entrada, setEntrada] = React.useState(naPlanta ? 10 : 20);
	const [mensais, setMensais] = React.useState(naPlanta ? 15 : 0);
	const [baloes, setBaloes] = React.useState(anuais > 0 ? 10 : 0);
	const [financiar, setFinanciar] = React.useState(true);
	const [taxa, setTaxa] = React.useState(12);
	const [prazo, setPrazo] = React.useState(30);

	const valor = unidades[unidade]?.preco || price;
	if (!(valor > 0)) return null;

	const pE = num(entrada, 0, 100);
	const pM = naPlanta ? num(mensais, 0, 100) : 0;
	const pB = anuais > 0 ? num(baloes, 0, 100) : 0;
	const pC = 100 - pE - pM - pB;
	const invalido = pC < 0;

	const vEntrada = (valor * pE) / 100;
	const nMensais = Math.max(meses - 1, 1);
	const vMensal = (valor * pM) / 100 / nMensais;
	const vBalao = anuais > 0 ? (valor * pB) / 100 / anuais : 0;
	const vChaves = (valor * Math.max(pC, 0)) / 100;

	// Financiamento SAC: amortização constante; juros sobre o saldo
	const n = num(prazo, 5, 35) * 12;
	const iMes = Math.pow(1 + num(taxa, 0, 30) / 100, 1 / 12) - 1;
	const amort = vChaves / n;
	const primeira = amort + vChaves * iMes;
	const ultima = amort + amort * iMes;
	const renda = primeira / 0.3;

	const linhas = [
		[`Entrada (${pE}%)`, brl(vEntrada)],
		naPlanta && pM > 0 && [`${nMensais} mensais (${pM}% no total)`, brl(vMensal)],
		anuais > 0 && pB > 0 && [`${anuais} ${anuais > 1 ? "parcelas anuais" : "parcela anual"} (${pB}% no total)`, brl(vBalao)],
		[`${naPlanta ? "Parcela das chaves" : "Saldo"} (${Math.max(pC, 0)}%)`, brl(vChaves)],
	].filter(Boolean);

	const resumo = [
		`Olá! Simulei o pagamento do ${name}${unidades[unidade]?.rotulo ? ` (${unidades[unidade].rotulo})` : ""} no site:`,
		...linhas.map(([a, b]) => `• ${a}: ${b}`),
		financiar && vChaves > 0 ? `• Financiamento: ${prazo} anos a ${taxa}% a.a., 1ª parcela ~${brl(primeira)}` : null,
		"Pode me enviar o fluxo oficial desta unidade?",
	]
		.filter(Boolean)
		.join("\n");

	return (
		<div className="simulador-pagamento mt-4" id="simulador">
			<h2 className="h4 mb-1">Simule o pagamento</h2>
			<p className="text-muted mb-3">
				{naPlanta
					? `Faltam cerca de ${meses} meses para a entrega. Ajuste os percentuais para ver como ficam as parcelas até as chaves.`
					: "Ajuste a entrada e veja como fica o financiamento do saldo."}
			</p>

			<div className="row g-3">
				{unidades.length > 1 && (
					<div className="col-12">
						<label htmlFor="sim-unidade" className="form-label small text-muted mb-1">
							Planta
						</label>
						<select
							id="sim-unidade"
							className="form-select form-select-sm"
							value={unidade}
							onChange={(e) => setUnidade(Number(e.target.value))}
						>
							{unidades.map((u, i) => (
								<option key={i} value={i}>
									{u.rotulo ? `${u.rotulo} – ` : ""}
									{brl(u.preco)}
								</option>
							))}
						</select>
					</div>
				)}
				<Campo id="sim-entrada" rotulo="Entrada" sufixo="%" valor={entrada} onChange={setEntrada} />
				{naPlanta && <Campo id="sim-mensais" rotulo="Mensais na obra" sufixo="%" valor={mensais} onChange={setMensais} />}
				{anuais > 0 && <Campo id="sim-baloes" rotulo="Parcelas anuais" sufixo="%" valor={baloes} onChange={setBaloes} />}
			</div>

			<div className="sim-resultado mt-3">
				<p className="small text-muted mb-2">Valor simulado: <strong className="text-dark">{brl(valor)}</strong></p>
				{invalido ? (
					<p className="text-danger small mb-0">A soma de entrada e parcelas passou de 100%. Diminua algum percentual.</p>
				) : (
					<ul className="list-unstyled mb-0">
						{linhas.map(([a, b]) => (
							<li key={a} className="d-flex justify-content-between gap-3 py-1">
								<span className="text-muted">{a}</span>
								<strong className="text-dark text-nowrap">{b}</strong>
							</li>
						))}
					</ul>
				)}
			</div>

			{!invalido && vChaves > 0 && (
				<div className="mt-3">
					<div className="form-check form-switch">
						<input
							className="form-check-input"
							type="checkbox"
							role="switch"
							id="sim-financiar"
							checked={financiar}
							onChange={(e) => setFinanciar(e.target.checked)}
						/>
						<label className="form-check-label small" htmlFor="sim-financiar">
							Financiar {naPlanta ? "a parcela das chaves" : "o saldo"} pelo banco
						</label>
					</div>
					{financiar && (
						<>
							<div className="row g-3 mt-0">
								<Campo id="sim-taxa" rotulo="Juros ao ano" sufixo="%" valor={taxa} onChange={setTaxa} max={30} step={0.1} />
								<Campo id="sim-prazo" rotulo="Prazo" sufixo="anos" valor={prazo} onChange={setPrazo} min={5} max={35} />
							</div>
							<ul className="list-unstyled sim-resultado mt-3 mb-0">
								<li className="d-flex justify-content-between gap-3 py-1">
									<span className="text-muted">1ª parcela (SAC)</span>
									<strong className="text-dark text-nowrap">{brl(primeira)}</strong>
								</li>
								<li className="d-flex justify-content-between gap-3 py-1">
									<span className="text-muted">Última parcela</span>
									<strong className="text-dark text-nowrap">{brl(ultima)}</strong>
								</li>
								<li className="d-flex justify-content-between gap-3 py-1">
									<span className="text-muted">Renda familiar sugerida</span>
									<strong className="text-dark text-nowrap">{brl(renda)}</strong>
								</li>
							</ul>
							{pC > 80 && (
								<p className="small text-muted mt-2 mb-0">
									Os bancos costumam financiar até 80% do valor do imóvel.
								</p>
							)}
						</>
					)}
				</div>
			)}

			<a
				href={`https://wa.me/${phone}?text=${encodeURIComponent(resumo)}`}
				target="_blank"
				rel="noopener noreferrer"
				className="btn btn-primary w-100 mt-3"
			>
				Receber o fluxo oficial desta unidade
			</a>
			<p className="small text-muted mt-2 mb-0">
				{naPlanta
					? "Simulação sem correção monetária: até as chaves, as parcelas costumam ser corrigidas pelo INCC; o financiamento soma juros e TR do banco. O fluxo real é definido pela incorporadora e o crédito depende de análise do banco."
					: "Simulação aproximada: o financiamento soma juros e TR do banco. As condições reais são definidas pela incorporadora e o crédito depende de análise do banco."}
			</p>
		</div>
	);
}
