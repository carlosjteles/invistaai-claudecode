import nodemailer from "nodemailer";

import { getBaseUrl } from "@/app/helper/utils";
import { contact } from "@/app/storage/about";

export const esc = (s) =>
	String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const brl = (v) =>
	new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(Number(v));

const ESTAGIO = { qualquer: "qualquer estágio", planta: "lançamento / em obras", pronto: "pronto novo" };

/** Texto curto do perfil do alerta: "Itaim Bibi, Jardins · até R$ 5 milhões · 3+ dorms · na planta" */
export const perfilTexto = (a, nomesBairros = []) =>
	[
		nomesBairros.length ? nomesBairros.join(", ") : "qualquer bairro",
		a.preco_max ? `até ${brl(a.preco_max)}` : "sem limite de preço",
		a.dorms_min ? `${a.dorms_min}+ dorms` : null,
		ESTAGIO[a.estagio] || null,
	]
		.filter(Boolean)
		.join(" · ");

export const whatsLink = (numero, texto) => {
	let n = String(numero).replace(/\D/g, "");
	if (n.length <= 11) n = `55${n}`;
	return `https://wa.me/${n}?text=${encodeURIComponent(texto)}`;
};

const transporter = () =>
	nodemailer.createTransport({
		service: "gmail",
		auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
	});

export async function enviarEmail({ para, assunto, html, responderPara }) {
	if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return false;
	try {
		await transporter().sendMail({
			from: `InvistaAí <${process.env.EMAIL_USER}>`,
			to: para || process.env.EMAIL_USER,
			replyTo: responderPara || contact.email,
			subject: assunto,
			html,
		});
		return true;
	} catch (e) {
		console.error("alerta e-mail:", e?.message);
		return false;
	}
}

/** Lista de imóveis em HTML simples, compatível com clientes de e-mail. */
export const listaImoveis = (imoveis) =>
	imoveis
		.map(
			(i) => `<tr><td style="padding:10px 0;border-bottom:1px solid #eee">
				<a href="${getBaseUrl()}/imovel/${esc(i.slug)}" style="color:#1e3a5f;font-weight:bold;text-decoration:none">${esc(i.name)}</a><br>
				<span style="color:#555;font-size:14px">${esc(i.neighborhood)}${i.preview?.area ? ` · ${esc(i.preview.area)}` : ""}${i.preview?.suite ? ` · ${esc(i.preview.suite)}` : ""}</span><br>
				${
					i.preco_antes
						? `<span style="font-size:14px">Preço baixou: <s style="color:#888">${brl(i.preco_antes)}</s> → <strong>${brl(i.price)}</strong></span>`
						: i.price > 0
						? `<span style="font-size:14px">A partir de <strong>${brl(i.price)}</strong></span>`
						: `<span style="font-size:14px">Preço sob consulta</span>`
				}
			</td></tr>`
		)
		.join("");

export const moldura = (conteudo) => `<!doctype html><html lang="pt-br"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;background:#faf8f5;font-family:Helvetica,Arial,sans-serif;color:#1f2937">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;border:1px solid #eee">
<tr><td style="padding:24px 28px;border-bottom:3px solid #b08d57;font-size:20px;font-weight:bold;color:#1e3a5f">InvistaAí</td></tr>
<tr><td style="padding:24px 28px;font-size:16px;line-height:1.55">${conteudo}</td></tr>
<tr><td style="padding:16px 28px;font-size:12px;color:#777;border-top:1px solid #eee">${esc(contact.broker?.name || "Carlos Teles")}, corretor de imóveis – CRECI ${esc(contact.broker?.creci || "230798")} · <a href="${getBaseUrl()}" style="color:#777">invistaai.com</a></td></tr>
</table></td></tr></table></body></html>`;
