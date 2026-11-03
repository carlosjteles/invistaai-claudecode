import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { getSiteName } from "@/app/helper/utils";

// Verificação anti-robô do Cloudflare Turnstile (a chave secreta fica só na Vercel: TURNSTILE_SECRET_KEY)
async function validarTurnstile(token, ip) {
	const secret = process.env.TURNSTILE_SECRET_KEY;
	if (!secret) {
		console.error("TURNSTILE_SECRET_KEY não configurada");
		return false;
	}
	try {
		const body = new URLSearchParams({ secret, response: String(token || "") });
		if (ip) body.append("remoteip", ip);
		const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
		const data = await r.json();
		return data.success === true;
	} catch (error) {
		console.error("Erro ao validar o Turnstile:", error);
		return false;
	}
}

const esc = (s) =>
	String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Envios recentes por IP (por instância do servidor): no máximo 3 por hora
const recentes = new Map();
function excedeuLimite(ip) {
	if (!ip) return false;
	const agora = Date.now();
	const lista = (recentes.get(ip) || []).filter((t) => agora - t < 3600000);
	lista.push(agora);
	recentes.set(ip, lista);
	return lista.length > 3;
}

const validateEmail = (email) => {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(String(email).toLowerCase());
};

export async function POST(request) {
	const corpo = await request.json().catch(() => ({}));
	const { subject, site, tempo } = corpo;
	const name = String(corpo.name || "").trim().slice(0, 100);
	const email = String(corpo.email || "").trim().slice(0, 150);
	const message = String(corpo.message || "").trim().slice(0, 4000);
	const ip = (request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "").split(",")[0].trim();

	// Robôs: campo escondido preenchido ou envio rápido demais. Respondemos "ok" sem enviar.
	if (site || (typeof tempo === "number" && tempo < 3000)) {
		return NextResponse.json({ message: "E-mail enviado com sucesso!" }, { status: 200 });
	}

	// Spam típico: links ou texto em outro alfabeto (cirílico, chinês etc.)
	const textoTodo = `${name} ${subject} ${message}`;
	if (/https?:\/\/|www\.|\[url|<a\s/i.test(textoTodo) || /[\u0400-\u04FF\u4E00-\u9FFF\u3040-\u30FF\u0600-\u06FF]/.test(textoTodo)) {
		return NextResponse.json({ message: "E-mail enviado com sucesso!" }, { status: 200 });
	}

	if (excedeuLimite(ip)) {
		return NextResponse.json({ error: "Muitos envios em sequência. Tente de novo mais tarde ou fale pelo WhatsApp." }, { status: 429 });
	}

	if (!name || !email || !subject || !message || !corpo.turnstile) {
		return NextResponse.json(
			{ message: "Todos os campos são obrigatórios!" },
			{ status: 400 }
		);
	}

	if (!validateEmail(email)) {
		return NextResponse.json({ error: "Email inválido" }, { status: 400 });
	}

	if (!(await validarTurnstile(corpo.turnstile, ip))) {
		return NextResponse.json(
			{ error: "Não conseguimos confirmar o envio. Atualize a página e tente de novo, ou fale pelo WhatsApp." },
			{ status: 400 }
		);
	}

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const template = `
        <!DOCTYPE html>
        <html lang="pt-br">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <title>Formulário de Contato - ${getSiteName()}</title>
                <style media="all">
                    /* ---- GLOBAL RESETS ---- */
                    body {
                        font-family: Helvetica, sans-serif;
                        -webkit-font-smoothing: antialiased;
                        font-size: 16px;
                        line-height: 1.3;
                        -ms-text-size-adjust: 100%;
                        -webkit-text-size-adjust: 100%;
                    }
                    table {
                        border-collapse: separate;
                        mso-table-lspace: 0;
                        mso-table-rspace: 0;
                        width: 100%;
                    }
                    table td {
                        font-family: Helvetica, sans-serif;
                        font-size: 16px;
                        vertical-align: top;
                    }
                    /* ---- BODY & CONTAINER ---- */
                    body {
                        background-color: #f4f5f6;
                        margin: 0;
                        padding: 0;
                        width: 100%;
                    }
                    .container {
                        margin: 0 auto !important;
                        max-width: 600px;
                        padding: 24px 0 0 0;
                        width: 600px;
                    }
                    .content {
                        box-sizing: border-box;
                        display: block;
                        margin: 0 auto;
                        max-width: 600px;
                        padding: 0;
                    }
                    /* ---- HEADER, FOOTER, MAIN ---- */
                    .main {
                        background: #ffffff;
                        border: 1px solid #eaebed;
                        border-radius: 16px;
                        width: 100%;
                    }
                    .wrapper {
                        box-sizing: border-box;
                        padding: 24px;
                    }
                    /* ---- TYPOGRAPHY ---- */
                    p {
                        font-family: Helvetica, sans-serif;
                        font-size: 16px;
                        font-weight: normal;
                        margin: 0 0 16px 0;
                    }
                    a {
                        color: #0867ec;
                        text-decoration: underline;
                    }
                    /* ---- Header ---- */
                    .header {
                        color: transparent;
                        display: none;
                        height: 0;
                        max-height: 0;
                        max-width: 0;
                        opacity: 0;
                        overflow: hidden;
                        mso-hide: all;
                        visibility: hidden;
                        width: 0;
                    }
                    /* ---- RESPONSIVE AND MOBILE FRIENDLY STYLES ---- */
                    @media only screen and (max-width: 640px) {
                        .main p,
                        .main td,
                        .main span {
                            font-size: 16px !important;
                        }
                        .wrapper {
                            padding: 8px !important;
                        }
                        .content {
                            padding: 0 !important;
                        }
                        .container {
                            padding: 0 !important;
                            padding-top: 8px !important;
                            width: 100% !important;
                        }
                        .main {
                            border-left-width: 0 !important;
                            border-radius: 0 !important;
                            border-right-width: 0 !important;
                        }
                    }
                    /* ---- PRESERVE THESE STYLES IN THE HEAD ---- */
                    @media all {
                        .apple-link a {
                            color: inherit !important;
                            font-family: inherit !important;
                            font-size: inherit !important;
                            font-weight: inherit !important;
                            line-height: inherit !important;
                            text-decoration: none !important;
                        }
                        #MessageViewBody a {
                            color: inherit;
                            text-decoration: none;
                            font-size: inherit;
                            font-family: inherit;
                            font-weight: inherit;
                            line-height: inherit;
                        }
                    }
                </style>
            </head>
            <body>
                <table role="presentation" class="body">
                    <tr>
                        <td>&nbsp;</td>
                        <td class="container">
                            <div class="content">
                                <span class="header">Novo Contato no Formulário ${getSiteName()}</span>
                                <table role="presentation" class="main">
                                    <tr>
                                        <td class="wrapper">
                                            <p>Nova mensagem recebida</p>
                                            <p><strong>Nome</strong>: ${esc(name)}</p>
                                            <p><strong>Email</strong>: ${esc(email)}</p>
                                            <p><strong>Assunto</strong>: ${esc(subject)}</p>
                                            <p><strong>Mensagem</strong>: ${esc(message).replace(/\n/g, "<br>")}</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                </table>
            </body>
        </html>
    `;

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: process.env.EMAIL_USER,
		subject: `Formulário ${getSiteName()} - Contato ${name}`,
		replyTo: email,
		html: template,
	};

	try {
		await transporter.sendMail(mailOptions);
		return NextResponse.json(
			{ message: "E-mail enviado com sucesso!" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Falha ao enviar e-mail" },
			{ status: 500 }
		);
	}
}
