"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { contact } from "../storage/about";

const brl = (v) =>
	new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(Number(v));

const LINHAS = [
	{ chave: "bairro", rotulo: "Bairro" },
	{ chave: "incorporadora", rotulo: "Incorporadora" },
	{ chave: "estagio", rotulo: "Estágio" },
	{ chave: "entrega", rotulo: "Entrega" },
	{ chave: "preco", rotulo: "Preço a partir de", fmt: (v) => (v ? brl(v) : "Consulte") },
	{ chave: "precoM2", rotulo: "Menor preço por m²", fmt: (v) => (v ? `${brl(v)}/m²` : "–"), melhor: "menor" },
	{ chave: "area", rotulo: "Metragem" },
	{ chave: "dormitorios", rotulo: "Dormitórios" },
	{ chave: "suites", rotulo: "Suítes" },
	{ chave: "vagas", rotulo: "Vagas" },
	{ chave: "plantas", rotulo: "Opções de planta", fmt: (v) => (v ? String(v) : "–") },
	{ chave: "metro", rotulo: "Metrô / trem mais próximo", fmt: (v) => v || "Mais de 2 km" },
	{ chave: "lazer", rotulo: "Itens de lazer", fmt: (v) => (v?.length ? `${v.length} itens` : "–") },
];

export default function CompararClient({ imoveis, iniciais }) {
	const router = useRouter();
	const [sel, setSel] = React.useState(() => {
		const base = [...iniciais];
		while (base.length < 3) base.push("");
		return base;
	});

	const porSlug = React.useMemo(() => Object.fromEntries(imoveis.map((i) => [i.slug, i])), [imoveis]);
	const escolhidos = sel.map((s) => (s ? porSlug[s] : null));
	const ativos = escolhidos.filter(Boolean);

	const atualizar = (idx, slug) => {
		const novo = [...sel];
		novo[idx] = slug;
		setSel(novo);
		const lista = novo.filter(Boolean);
		router.replace(lista.length ? `/comparar?imoveis=${lista.join(",")}` : "/comparar", { scroll: false });
	};

	const melhorM2 = React.useMemo(() => {
		const vals = ativos.map((a) => a.precoM2).filter(Boolean);
		return ativos.length > 1 && vals.length > 1 ? Math.min(...vals) : null;
	}, [ativos]);

	const lazerComum = React.useMemo(() => {
		if (ativos.length < 2) return [];
		return ativos[0].lazer.filter((item) => ativos.every((a) => a.lazer.includes(item)));
	}, [ativos]);

	const whatsapp = () => {
		const nomes = ativos.map((a) => a.nome).join(", ");
		const texto = `Olá! Comparei no site da InvistaAí e gostaria de receber as tabelas e plantas de: ${nomes}.`;
		return `https://wa.me/${contact.phone}?text=${encodeURIComponent(texto)}`;
	};

	return (
		<>
			<div className="row g-3">
				{sel.map((slug, idx) => (
					<div className="col-md-4" key={idx}>
						<label className="form-label small text-muted" htmlFor={`imovel-${idx}`}>
							Imóvel {idx + 1}
						</label>
						<select
							id={`imovel-${idx}`}
							className="form-select"
							value={slug}
							onChange={(e) => atualizar(idx, e.target.value)}
						>
							<option value="">Escolha um empreendimento</option>
							{imoveis.map((i) => (
								<option key={i.slug} value={i.slug} disabled={sel.includes(i.slug) && i.slug !== slug}>
									{i.nome} – {i.bairro}
								</option>
							))}
						</select>
					</div>
				))}
			</div>

			{ativos.length === 0 ? (
				<p className="text-muted text-center mt-5">Escolha pelo menos um empreendimento para começar a comparação.</p>
			) : (
				<div className="card border-0 shadow rounded-3 mt-4 overflow-hidden">
					<div className="table-responsive">
						<table className="table table-borderless align-middle mb-0">
							<thead>
								<tr className="border-bottom">
									<th scope="col" style={{ minWidth: 150 }}></th>
									{escolhidos.map((p, idx) =>
										p ? (
											<th scope="col" key={p.slug} style={{ minWidth: 220 }}>
												{p.foto && (
													<Link href={`/imovel/${p.slug}`} className="d-block mb-2">
														<Image
															src={p.foto}
															alt={p.fotoAlt}
															width={0}
															height={0}
															sizes="(max-width: 768px) 80vw, 30vw"
															className="rounded-3"
															style={{ width: "100%", height: 140, objectFit: "cover" }}
														/>
													</Link>
												)}
												<Link href={`/imovel/${p.slug}`} className="text-dark fw-semibold">
													{p.nome}
												</Link>
											</th>
										) : (
											<th scope="col" key={`vazio-${idx}`} className="text-muted small fw-normal">
												—
											</th>
										)
									)}
								</tr>
							</thead>
							<tbody>
								{LINHAS.map((linha) => (
									<tr className="border-bottom" key={linha.chave}>
										<th scope="row" className="text-muted small fw-normal">
											{linha.rotulo}
										</th>
										{escolhidos.map((p, idx) => {
											if (!p) return <td key={`v-${idx}`}></td>;
											const valor = p[linha.chave];
											const destaque = linha.melhor === "menor" && melhorM2 && valor === melhorM2;
											return (
												<td key={p.slug} className={destaque ? "fw-semibold text-primary" : ""}>
													{linha.fmt ? linha.fmt(valor) : valor || "–"}
													{destaque && <small className="d-block text-muted fw-normal">menor preço por m²</small>}
												</td>
											);
										})}
									</tr>
								))}
								<tr>
									<th scope="row"></th>
									{escolhidos.map((p, idx) =>
										p ? (
											<td key={p.slug}>
												<Link href={`/imovel/${p.slug}`} className="btn btn-sm btn-soft-primary w-100">
													Ver detalhes
												</Link>
											</td>
										) : (
											<td key={`b-${idx}`}></td>
										)
									)}
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			)}

			{lazerComum.length > 0 && (
				<p className="text-muted small mt-3">
					<strong>Lazer em comum:</strong> {lazerComum.join(", ")}.
				</p>
			)}

			{ativos.length > 0 && (
				<div className="text-center mt-4">
					<a href={whatsapp()} target="_blank" rel="noopener noreferrer" className="btn btn-pills btn-primary">
						Receber as tabelas {ativos.length > 1 ? "desses imóveis" : "deste imóvel"} pelo WhatsApp
					</a>
				</div>
			)}
		</>
	);
}
