"use client";
import React from "react";
import Link from "next/link";

const FAIXAS = [
	[2000000, "Até R$ 2 milhões"],
	[3000000, "Até R$ 3 milhões"],
	[5000000, "Até R$ 5 milhões"],
	[8000000, "Até R$ 8 milhões"],
	[12000000, "Até R$ 12 milhões"],
	[20000000, "Até R$ 20 milhões"],
	["", "Sem limite"],
];

const brl = (v) =>
	new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

/** Arredonda o preço para a faixa imediatamente acima (para pré-preencher o alerta na página do imóvel). */
export const faixaAcima = (preco) => {
	const f = FAIXAS.find(([v]) => v && preco > 0 && preco * 1.15 <= v);
	return f ? String(f[0]) : "";
};

/**
 * Cadastro de alerta: o visitante escolhe bairros, faixa de preço, dormitórios e estágio e recebe
 * aviso quando entrar um imóvel novo ou um preço baixar nesse perfil.
 */
export default function AlertaImoveis({
	bairros = [],
	inicial = {},
	titulo = "Receba novidades no seu perfil",
	subtitulo = "Avisamos quando entrar um imóvel novo ou quando o preço de um imóvel baixar, dentro do que você procura.",
	origem = "",
}) {
	const [form, setForm] = React.useState({
		nome: "",
		whatsapp: "",
		email: "",
		bairros: inicial.bairros || [],
		precoMax: inicial.precoMax ?? "",
		dorms: inicial.dorms ?? "",
		estagio: inicial.estagio || "qualquer",
		consentimento: false,
		site: "", // armadilha para robôs (campo escondido)
	});
	const [abertos, setAbertos] = React.useState(false);
	const [status, setStatus] = React.useState({ tipo: "", msg: "" });
	const [resultado, setResultado] = React.useState(null);
	const inicio = React.useRef(Date.now());

	const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
	const alternaBairro = (slug) =>
		set("bairros", form.bairros.includes(slug) ? form.bairros.filter((b) => b !== slug) : [...form.bairros, slug]);

	const enviar = async (e) => {
		e.preventDefault();
		if (form.whatsapp.replace(/\D/g, "").length < 10) {
			setStatus({ tipo: "erro", msg: "Informe um WhatsApp com DDD." });
			return;
		}
		if (!form.consentimento) {
			setStatus({ tipo: "erro", msg: "Marque a autorização para receber os avisos." });
			return;
		}
		setStatus({ tipo: "enviando", msg: "" });
		try {
			const r = await fetch("/api/alerta", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...form, origem: origem || window.location.pathname, tempo: Date.now() - inicio.current }),
			});
			const dados = await r.json().catch(() => ({}));
			if (!r.ok) throw new Error(dados.erro || "Não foi possível cadastrar agora.");
			setResultado(dados);
			setStatus({ tipo: "ok", msg: "" });
		} catch (err) {
			setStatus({ tipo: "erro", msg: err.message || "Não foi possível cadastrar agora. Tente pelo WhatsApp." });
		}
	};

	const visiveis = abertos ? bairros : bairros.slice(0, 8);

	return (
		<div className="alerta-imoveis rounded-3 shadow p-4 p-md-5 bg-white" id="alerta">
			{status.tipo === "ok" && resultado ? (
				<div>
					<h2 className="h4 mb-2">Alerta criado</h2>
					<p className="text-muted">
						Pronto, {form.nome.split(" ")[0] || "tudo certo"}! Vamos avisar pelo WhatsApp
						{form.email ? " e por e-mail" : ""} quando surgir uma novidade no seu perfil.
					</p>
					{resultado.imoveis?.length > 0 ? (
						<>
							<p className="mb-2">
								Hoje temos <strong>{resultado.total}</strong>{" "}
								{resultado.total === 1 ? "imóvel" : "imóveis"} nesse perfil:
							</p>
							<ul className="list-unstyled mb-0">
								{resultado.imoveis.map((i) => (
									<li key={i.slug} className="py-1">
										<Link href={`/imovel/${i.slug}`} className="text-primary fw-semibold">
											{i.name}
										</Link>
										<span className="text-muted small">
											{" "}
											· {i.neighborhood}
											{i.price > 0 ? ` · a partir de ${brl(i.price)}` : ""}
										</span>
									</li>
								))}
							</ul>
						</>
					) : (
						<p className="mb-0">Ainda não temos imóveis nesse perfil. Você será o primeiro a saber quando entrar.</p>
					)}
				</div>
			) : (
				<form onSubmit={enviar} noValidate>
					<h2 className="h4 mb-1">{titulo}</h2>
					<p className="text-muted mb-4">{subtitulo}</p>

					<div className="row g-3">
						{bairros.length > 0 && (
							<div className="col-12">
								<span className="form-label small text-muted d-block mb-2">
									Bairros <span className="fw-normal">(deixe em branco para qualquer bairro)</span>
								</span>
								<div className="d-flex flex-wrap gap-2">
									{visiveis.map((b) => (
										<button
											type="button"
											key={b.slug}
											className={`btn btn-sm alerta-chip ${form.bairros.includes(b.slug) ? "ativo" : ""}`}
											aria-pressed={form.bairros.includes(b.slug)}
											onClick={() => alternaBairro(b.slug)}
										>
											{b.nome}
										</button>
									))}
									{bairros.length > 8 && (
										<button type="button" className="btn btn-sm btn-link px-1" onClick={() => setAbertos(!abertos)}>
											{abertos ? "menos" : `+${bairros.length - 8} bairros`}
										</button>
									)}
								</div>
							</div>
						)}

						<div className="col-md-4 col-12">
							<label htmlFor="al-preco" className="form-label small text-muted mb-1">Preço</label>
							<select id="al-preco" className="form-select" value={form.precoMax} onChange={(e) => set("precoMax", e.target.value)}>
								{FAIXAS.map(([v, r]) => (
									<option key={r} value={v}>{r}</option>
								))}
							</select>
						</div>
						<div className="col-md-4 col-6">
							<label htmlFor="al-dorms" className="form-label small text-muted mb-1">Dormitórios</label>
							<select id="al-dorms" className="form-select" value={form.dorms} onChange={(e) => set("dorms", e.target.value)}>
								<option value="">Qualquer</option>
								<option value="2">2 ou mais</option>
								<option value="3">3 ou mais</option>
								<option value="4">4 ou mais</option>
							</select>
						</div>
						<div className="col-md-4 col-6">
							<label htmlFor="al-estagio" className="form-label small text-muted mb-1">Estágio</label>
							<select id="al-estagio" className="form-select" value={form.estagio} onChange={(e) => set("estagio", e.target.value)}>
								<option value="qualquer">Qualquer</option>
								<option value="planta">Na planta / em obra</option>
								<option value="pronto">Pronto para morar</option>
							</select>
						</div>

						<div className="col-md-4 col-12">
							<label htmlFor="al-nome" className="form-label small text-muted mb-1">Nome</label>
							<input id="al-nome" className="form-control" autoComplete="name" value={form.nome} onChange={(e) => set("nome", e.target.value)} required />
						</div>
						<div className="col-md-4 col-12">
							<label htmlFor="al-whats" className="form-label small text-muted mb-1">WhatsApp com DDD</label>
							<input id="al-whats" type="tel" inputMode="tel" className="form-control" autoComplete="tel" placeholder="(11) 90000-0000" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} required />
						</div>
						<div className="col-md-4 col-12">
							<label htmlFor="al-email" className="form-label small text-muted mb-1">E-mail (opcional)</label>
							<input id="al-email" type="email" className="form-control" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
						</div>
						<div className="d-none" aria-hidden="true">
							<label htmlFor="al-site">Site</label>
							<input id="al-site" tabIndex={-1} autoComplete="off" value={form.site} onChange={(e) => set("site", e.target.value)} />
						</div>

						<div className="col-12">
							<div className="form-check">
								<input className="form-check-input" type="checkbox" id="al-ok" checked={form.consentimento} onChange={(e) => set("consentimento", e.target.checked)} />
								<label className="form-check-label small text-muted" htmlFor="al-ok">
									Autorizo a InvistaAí a me enviar avisos de imóveis por WhatsApp e e-mail. Posso cancelar quando quiser.
								</label>
							</div>
						</div>
					</div>

					{status.tipo === "erro" && <p className="text-danger small mt-3 mb-0" role="alert">{status.msg}</p>}

					<button type="submit" className="btn btn-primary mt-3" disabled={status.tipo === "enviando"}>
						{status.tipo === "enviando" ? "Criando alerta..." : "Criar meu alerta"}
					</button>
				</form>
			)}
		</div>
	);
}
