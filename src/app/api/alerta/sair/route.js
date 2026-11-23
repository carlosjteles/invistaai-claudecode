import prisma from "@/db/prisma";

export const dynamic = "force-dynamic";

const pagina = (titulo, texto) =>
	new Response(
		`<!doctype html><html lang="pt-br"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${titulo} | InvistaAí</title></head>
<body style="margin:0;font-family:Helvetica,Arial,sans-serif;background:#faf8f5;color:#1f2937">
<div style="max-width:520px;margin:15vh auto;padding:32px;background:#fff;border-radius:12px;border:1px solid #eee;text-align:center">
<h1 style="font-size:22px;color:#1e3a5f;margin:0 0 12px">${titulo}</h1><p style="margin:0 0 20px;line-height:1.5">${texto}</p>
<a href="/" style="color:#1e3a5f">Voltar ao site</a></div></body></html>`,
		{ headers: { "Content-Type": "text/html; charset=utf-8" } }
	);

/** Cancela um alerta pelo link do e-mail (/api/alerta/sair?t=<token>). */
export async function GET(request) {
	const t = new URL(request.url).searchParams.get("t") || "";
	if (!/^[0-9a-f-]{36}$/i.test(t)) return pagina("Link inválido", "Não encontramos este alerta.");
	try {
		const n = await prisma.$executeRaw`
			update conteudo.alertas set ativo = false, cancelado_em = now() where token = ${t}::uuid and ativo`;
		return pagina(
			"Alerta cancelado",
			n > 0 ? "Você não vai mais receber avisos deste alerta." : "Este alerta já estava cancelado."
		);
	} catch (e) {
		return pagina("Tente de novo", "Não foi possível cancelar agora. Responda o e-mail que cancelamos para você.");
	}
}
