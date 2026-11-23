import React from "react";

// Caminhada a ~80 m/min, que é o ritmo usado pelo Google Maps a pé.
const minutos = (m) => Math.max(1, Math.round(m / 80));
const distancia = (m) =>
	m >= 1000 ? `${(m / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km` : `${m} m`;

/**
 * Metrô e polos de demanda com distância real e tempo a pé.
 * Usado nas páginas de imóvel que não mostram a análise de renda completa.
 */
export default function Proximidades({ analise, nome }) {
	const metro = analise?.metro || null;
	const polos = Array.isArray(analise?.polos) ? analise.polos.slice(0, 5) : [];
	if (!metro && polos.length === 0) return null;

	return (
		<div className="mb-4">
			<h2 className="h4 mb-3 text-dark">O que fica perto do {nome}</h2>
			<ul className="list-unstyled mb-2">
				{metro && (
					<li className="d-flex justify-content-between gap-2 py-2 border-bottom">
						<span>{metro.nome}</span>
						<span className="text-muted text-nowrap">
							{distancia(metro.dist)} · {minutos(metro.dist)} min a pé
						</span>
					</li>
				)}
				{polos.map((p) => (
					<li
						className="d-flex justify-content-between gap-2 py-2 border-bottom"
						key={p.nome}
					>
						<span>
							{p.nome}
							{p.tipo && <span className="text-muted small"> · {p.tipo}</span>}
						</span>
						<span className="text-muted text-nowrap">
							{distancia(p.dist)} · {minutos(p.dist)} min a pé
						</span>
					</li>
				))}
			</ul>
			<p className="text-muted small mb-0">
				Distâncias em linha reta a partir do endereço do empreendimento, com o
				tempo estimado a pé. O percurso real pode variar.
			</p>
		</div>
	);
}
