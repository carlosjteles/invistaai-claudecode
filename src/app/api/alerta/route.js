import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/db/prisma";
import { getBaseUrl } from "@/app/helper/utils";

import { esc, perfilTexto, whatsLink, enviarEmail, listaImoveis, moldura } from "./email";

export const dynamic = "force-dynamic";

const Schema = z.object({
	nome: z.string().trim().min(2).max(80),
	whatsapp: z.string().trim().max(30),
	email: z.union([z.literal(""), z.string().trim().email().max(120)]).optional(),
	bairros: z.array(z.string().regex(/^[a-z0-9-]{2,60}$/)).max(20).default([]),
	precoMax: z.union([z.literal(""), z.coerce.number().positive().max(1e9)]).optional(),
	dorms: z.union([z.literal(""), z.coerce.number().int().min(1).max(6)]).optional(),
	estagio: z.enum(["qualquer", "planta", "pronto"]).default("qualquer"),
	consentimento: z.literal(true),
	origem: z.string().max(200).optional(),
	site: z.string().optional(),
	tempo: z.number().optional(),
});

export async function POST(request) {
	let d;
	try {
		d = Schema.parse(await request.json());
	} catch (e) {
		return NextResponse.json({ erro: "Confira os dados do formulário." }, { status: 400 });
	}

	const whatsapp = d.whatsapp.replace(/\D/g, "");
	if (whatsapp.length < 10 || whatsapp.length > 13) {
		return NextResponse.json({ erro: "Informe um WhatsApp com DDD." }, { status: 400 });
	}
	// Robôs: preenchem o campo escondido ou enviam rápido demais. Respondemos "ok" sem gravar.
	if (d.site || (d.tempo ?? 99999) < 2500) {
		return NextResponse.json({ ok: true, total: 0, imoveis: [] });
	}

	const precoMax = d.precoMax === "" || d.precoMax == null ? null : Number(d.precoMax);
	const dorms = d.dorms === "" || d.dorms == null ? null : Number(d.dorms);
	const email = d.email || null;

	try {
		// Evita cadastros repetidos do mesmo número em poucos minutos
		const recentes = await prisma.$queryRaw`
			select count(*)::int n from conteudo.alertas
			where whatsapp = ${whatsapp} and criado_em > now() - interval '2 minutes'`;
		if (recentes[0]?.n > 0) {
			return NextResponse.json({ erro: "Seu alerta já foi criado. Aguarde alguns minutos para criar outro." }, { status: 429 });
		}

		const [alerta] = await prisma.$queryRaw`
			insert into conteudo.alertas (nome, whatsapp, email, bairros, preco_max, dorms_min, estagio, origem)
			values (${d.nome}, ${whatsapp}, ${email}, ${d.bairros}::text[], ${precoMax}::numeric, ${dorms}::int, ${d.estagio}, ${d.origem || null})
			returning id, token::text, bairros, preco_max, dorms_min, estagio`;

		const imoveis = await prisma.$queryRaw`
			select * from conteudo.imoveis_do_perfil(${d.bairros}::text[], ${precoMax}::numeric, ${dorms}::int, ${d.estagio})`;

		// O que já existe hoje não é "novidade": registra para não reenviar depois
		if (imoveis.length) {
			await prisma.$executeRaw`
				insert into conteudo.alerta_envios (alerta_id, property_id, motivo, preco)
				select ${alerta.id}::bigint, i.id, 'inicial', coalesce(i.price, 0)
				from conteudo.imoveis_do_perfil(${d.bairros}::text[], ${precoMax}::numeric, ${dorms}::int, ${d.estagio}) i
				on conflict do nothing`;
		}

		const nomesBairros = d.bairros.length
			? (await prisma.$queryRaw`select nome from conteudo.bairros where slug = any(${d.bairros}::text[]) order by ordem`).map((b) => b.nome)
			: [];
		const perfil = perfilTexto(alerta, nomesBairros);
		const primeiros = imoveis.slice(0, 6);

		// Aviso para o Carlos (lead novo), com link de WhatsApp já escrito
		const msgLead = `Olá, ${d.nome.split(" ")[0]}! Aqui é o Carlos, da InvistaAí. Recebi seu alerta (${perfil}). ${
			imoveis.length ? `Hoje temos ${imoveis.length} opções nesse perfil. Quer que eu envie as tabelas atualizadas?` : "Assim que entrar uma opção nesse perfil eu te aviso. Posso te ajudar com mais alguma preferência?"
		}`;
		await enviarEmail({
			assunto: `Novo alerta de imóveis – ${d.nome}`,
			responderPara: email || undefined,
			html: moldura(`
				<p style="margin:0 0 12px"><strong>Novo alerta criado no site</strong></p>
				<p style="margin:0 0 4px"><strong>Nome:</strong> ${esc(d.nome)}</p>
				<p style="margin:0 0 4px"><strong>WhatsApp:</strong> ${esc(whatsapp)}</p>
				<p style="margin:0 0 4px"><strong>E-mail:</strong> ${esc(email || "–")}</p>
				<p style="margin:0 0 4px"><strong>Perfil:</strong> ${esc(perfil)}</p>
				<p style="margin:0 0 16px"><strong>Página:</strong> ${esc(d.origem || "")}</p>
				<p style="margin:0 0 16px"><a href="${whatsLink(whatsapp, msgLead)}" style="background:#1e3a5f;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Responder no WhatsApp</a></p>
				<p style="margin:0 0 4px">${imoveis.length} imóveis no perfil hoje${imoveis.length > 6 ? " (6 primeiros)" : ""}:</p>
				<table role="presentation" width="100%">${listaImoveis(primeiros)}</table>`),
		});

		// Confirmação para o cliente, se deixou e-mail
		if (email) {
			const sair = `${getBaseUrl()}/api/alerta/sair?t=${alerta.token}`;
			await enviarEmail({
				para: email,
				assunto: "Seu alerta de imóveis foi criado",
				html: moldura(`
					<p style="margin:0 0 12px">Olá, ${esc(d.nome.split(" ")[0])}!</p>
					<p style="margin:0 0 12px">Seu alerta foi criado: <strong>${esc(perfil)}</strong>. Vamos avisar quando entrar um imóvel novo ou quando um preço baixar nesse perfil.</p>
					${imoveis.length ? `<p style="margin:0 0 4px">Hoje temos ${imoveis.length} ${imoveis.length === 1 ? "opção" : "opções"}:</p><table role="presentation" width="100%">${listaImoveis(primeiros)}</table>` : ""}
					<p style="margin:16px 0 0;font-size:13px;color:#777">Não quer mais receber? <a href="${sair}" style="color:#777">Cancelar este alerta</a>.</p>`),
			});
		}

		return NextResponse.json({
			ok: true,
			total: imoveis.length,
			imoveis: primeiros.map((i) => ({ slug: i.slug, name: i.name, neighborhood: i.neighborhood, price: Number(i.price) })),
		});
	} catch (e) {
		console.error("alerta:", e);
		return NextResponse.json({ erro: "Não foi possível cadastrar agora. Tente pelo WhatsApp." }, { status: 500 });
	}
}

