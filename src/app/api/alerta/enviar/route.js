import { NextResponse } from "next/server";

import prisma from "@/db/prisma";
import { getBaseUrl } from "@/app/helper/utils";

import { esc, perfilTexto, whatsLink, enviarEmail, listaImoveis, moldura } from "../email";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Envio semanal dos alertas (chamado pelo agendamento do banco, com a chave guardada em conteudo.config).
 * Para cada alerta com novidade: e-mail para o cliente (se deixou e-mail) e um resumo para o Carlos
 * com o link de WhatsApp já escrito para cada cliente.
 */
export async function POST(request) {
	const chave = request.headers.get("x-chave") || "";
	const [cfg] = await prisma.$queryRaw`select valor from conteudo.config where chave = 'alertas_segredo'`;
	if (!cfg?.valor || chave !== cfg.valor) {
		return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
	}

	const pendentes = await prisma.$queryRaw`
		select p.alerta_id, p.motivo, p.property_id, p.preco, p.preco_antes,
		       a.nome, a.whatsapp, a.email, a.token::text token, a.bairros, a.preco_max, a.dorms_min, a.estagio,
		       i.slug, i.name, i.neighborhood, i.price, i.preview,
		       (select coalesce(array_agg(b.nome order by b.ordem), '{}') from conteudo.bairros b where b.slug = any(a.bairros)) nomes_bairros
		from conteudo.alertas_pendentes() p
		join conteudo.alertas a on a.id = p.alerta_id
		join "Property" i on i.id = p.property_id
		order by p.alerta_id, p.motivo desc, i.price desc`;

	const porAlerta = new Map();
	for (const r of pendentes) {
		const k = String(r.alerta_id);
		if (!porAlerta.has(k)) porAlerta.set(k, { alerta: r, itens: [] });
		porAlerta.get(k).itens.push({ ...r, price: Number(r.preco || r.price), preco_antes: r.preco_antes ? Number(r.preco_antes) : null });
	}

	const resumoCarlos = [];
	let emailsClientes = 0;

	for (const { alerta: a, itens } of porAlerta.values()) {
		const perfil = perfilTexto(a, a.nomes_bairros || []);
		const primeiro = a.nome.split(" ")[0];
		const lista = itens.slice(0, 8);

		if (a.email) {
			const ok = await enviarEmail({
				para: a.email,
				assunto: itens.length === 1 ? `Novidade no seu alerta: ${itens[0].name}` : `${itens.length} novidades no seu alerta de imóveis`,
				html: moldura(`
					<p style="margin:0 0 12px">Olá, ${esc(primeiro)}!</p>
					<p style="margin:0 0 4px">Novidades no seu alerta (<strong>${esc(perfil)}</strong>):</p>
					<table role="presentation" width="100%">${listaImoveis(lista)}</table>
					<p style="margin:16px 0 0">Quer a tabela atualizada e as plantas? É só responder este e-mail ou chamar no WhatsApp.</p>
					<p style="margin:16px 0 0;font-size:13px;color:#777"><a href="${getBaseUrl()}/api/alerta/sair?t=${a.token}" style="color:#777">Cancelar este alerta</a>.</p>`),
			});
			if (ok) emailsClientes++;
		}

		const texto = [
			`Olá, ${primeiro}! Aqui é o Carlos, da InvistaAí. Novidades no seu alerta de imóveis:`,
			...lista.map((i) =>
				i.motivo === "baixou"
					? `• ${i.name} (${i.neighborhood}): preço baixou para a partir de ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(i.price)} – ${getBaseUrl()}/imovel/${i.slug}`
					: `• ${i.name} (${i.neighborhood}) – ${getBaseUrl()}/imovel/${i.slug}`
			),
			"Quer que eu te envie as tabelas atualizadas?",
		].join("\n");

		resumoCarlos.push(`
			<tr><td style="padding:14px 0;border-bottom:2px solid #eee">
				<strong>${esc(a.nome)}</strong> · ${esc(a.whatsapp)}${a.email ? ` · ${esc(a.email)}` : ""}<br>
				<span style="color:#555;font-size:14px">${esc(perfil)}</span>
				<table role="presentation" width="100%">${listaImoveis(lista)}</table>
				<a href="${whatsLink(a.whatsapp, texto)}" style="display:inline-block;margin-top:8px;background:#1e3a5f;color:#fff;padding:8px 14px;border-radius:6px;text-decoration:none">Enviar no WhatsApp</a>
			</td></tr>`);

		// Marca como avisado (mesmo que o cliente não tenha e-mail: o Carlos recebe o resumo)
		for (const i of itens) {
			await prisma.$executeRaw`
				insert into conteudo.alerta_envios (alerta_id, property_id, motivo, preco)
				values (${i.alerta_id}::bigint, ${i.property_id}::int, ${i.motivo}, ${i.motivo === "baixou" ? i.price : 0}::numeric)
				on conflict do nothing`;
		}
	}

	if (resumoCarlos.length) {
		await enviarEmail({
			assunto: `Alertas da semana: ${resumoCarlos.length} ${resumoCarlos.length === 1 ? "cliente" : "clientes"} com novidades`,
			html: moldura(`
				<p style="margin:0 0 12px"><strong>${resumoCarlos.length} ${resumoCarlos.length === 1 ? "cliente tem" : "clientes têm"} novidades nos alertas.</strong>
				${emailsClientes ? `${emailsClientes} ${emailsClientes === 1 ? "recebeu" : "receberam"} e-mail automático.` : ""}
				Use o botão de cada um para enviar a mensagem pronta no WhatsApp.</p>
				<table role="presentation" width="100%">${resumoCarlos.join("")}</table>`),
		});
	}

	return NextResponse.json({ ok: true, clientes: porAlerta.size, avisos: pendentes.length, emailsClientes });
}
