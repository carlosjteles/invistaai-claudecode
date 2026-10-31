"use client";

import React from "react";
import Link from "next/link";

const brl = (v) =>
	new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(Number(v));

const normalizar = (s) =>
	(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function IndiceTable({ linhas, cidade }) {
	const [busca, setBusca] = React.useState("");
	const [ordem, setOrdem] = React.useState("mediana");
	const [todos, setTodos] = React.useState(false);

	const max = React.useMemo(() => Math.max(...linhas.map((l) => l.mediana), 1), [linhas]);

	const filtradas = React.useMemo(() => {
		const q = normalizar(busca);
		let r = linhas.filter((l) => !q || normalizar(l.bairro).includes(q));
		if (ordem === "bairro") r = [...r].sort((a, b) => a.bairro.localeCompare(b.bairro, "pt-BR"));
		if (ordem === "mediana") r = [...r].sort((a, b) => b.mediana - a.mediana);
		if (ordem === "menor") r = [...r].sort((a, b) => a.mediana - b.mediana);
		return r;
	}, [linhas, busca, ordem]);

	const visiveis = todos || busca ? filtradas : filtradas.slice(0, 30);

	return (
		<div className="card border-0 shadow rounded-3 p-4">
			<div className="row g-3 mb-3">
				<div className="col-md-7">
					<input
						type="search"
						className="form-control"
						placeholder="Buscar bairro (ex.: Moema, Pinheiros, Brooklin)"
						value={busca}
						onChange={(e) => setBusca(e.target.value)}
						aria-label="Buscar bairro"
					/>
				</div>
				<div className="col-md-5">
					<select className="form-select" value={ordem} onChange={(e) => setOrdem(e.target.value)} aria-label="Ordenar">
						<option value="mediana">Maior preço do m²</option>
						<option value="menor">Menor preço do m²</option>
						<option value="bairro">Bairro (A–Z)</option>
					</select>
				</div>
			</div>

			<div className="table-responsive">
				<table className="table table-borderless align-middle mb-0">
					<thead>
						<tr className="text-muted small border-bottom">
							<th scope="col">Bairro</th>
							<th scope="col" style={{ minWidth: 180 }}>Preço mediano do m²</th>
							<th scope="col" className="d-none d-md-table-cell">Faixa central</th>
							<th scope="col" className="text-end">Empreend.</th>
						</tr>
					</thead>
					<tbody>
						{visiveis.map((l) => {
							const dif = Math.round((l.mediana / cidade - 1) * 100);
							return (
								<tr key={l.bairro} className="border-bottom">
									<td>
										<span className="fw-semibold">{l.bairro}</span>
										{l.imoveisNoSite > 0 && (
											<Link href={`/imoveis?q=${encodeURIComponent(l.bairro)}`} className="d-block small text-primary">
												Ver {l.imoveisNoSite} {l.imoveisNoSite === 1 ? "imóvel" : "imóveis"} no site
											</Link>
										)}
									</td>
									<td>
										<div className="fw-semibold">{brl(l.mediana)}</div>
										<div className="bg-light rounded mt-1" style={{ height: 6 }}>
											<div className="bg-primary rounded" style={{ height: 6, width: `${(l.mediana / max) * 100}%` }}></div>
										</div>
										<small className="text-muted">
											{dif === 0 ? "igual à mediana da cidade" : `${dif > 0 ? "+" : ""}${dif}% em relação à cidade`}
										</small>
									</td>
									<td className="d-none d-md-table-cell text-muted small">
										{brl(l.p25)} a {brl(l.p75)}
									</td>
									<td className="text-end text-muted">{l.n}</td>
								</tr>
							);
						})}
						{visiveis.length === 0 && (
							<tr>
								<td colSpan={4} className="text-muted">
									Nenhum bairro encontrado. O índice mostra apenas bairros com pelo menos 5 empreendimentos novos.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{!busca && !todos && filtradas.length > 30 && (
				<div className="text-center mt-3">
					<button type="button" className="btn btn-pills btn-soft-primary" onClick={() => setTodos(true)}>
						Ver todos os {filtradas.length} bairros
					</button>
				</div>
			)}
		</div>
	);
}
