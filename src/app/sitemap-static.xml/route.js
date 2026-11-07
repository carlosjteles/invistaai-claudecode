import { NextResponse } from "next/server";
import { getBaseUrl } from "../helper/utils";
import { lastmodDe } from "../helper/lastmod";
import prisma from "../../db/prisma";

export const revalidate = 86400;

export async function GET() {
	const baseUrl = getBaseUrl();

	// Páginas que listam imóveis mudam quando o catálogo muda; as institucionais
	// e legais, não. Dizer que tudo mudou hoje, todo dia, faz o Google deixar de
	// confiar no lastmod deste arquivo.
	let ultimoImovel = null;
	try {
		const r = await prisma.property.aggregate({ _max: { updatedAt: true } });
		ultimoImovel = r?._max?.updatedAt || null;
	} catch (e) {
		ultimoImovel = null;
	}

	const SEM_CATALOGO = new Set([
		"/sobre",
		"/contato",
		"/perguntas-frequentes",
		"/politica-de-privacidade",
		"/termos-e-condicoes",
	]);

	let bairros = [];
	try {
		bairros = await prisma.$queryRaw`select slug from conteudo.bairros where ativo order by ordem`;
	} catch (e) {
		bairros = [];
	}

	let incorporadoras = [];
	try {
		incorporadoras = await prisma.$queryRaw`select slug from conteudo.incorporadoras where ativo order by ordem`;
	} catch (e) {
		incorporadoras = [];
	}

	const urls = [
		{
			loc: baseUrl,
			changeFrequency: "monthly",
			priority: 1.0,
		},
		{
			loc: `${baseUrl}/imoveis`,
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			loc: `${baseUrl}/lancamentos`,
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			loc: `${baseUrl}/coberturas`,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			loc: `${baseUrl}/gardens`,
			changeFrequency: "weekly",
			priority: 0.7,
		},
		{
			loc: `${baseUrl}/investimento`,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			loc: `${baseUrl}/indice-preco-m2`,
			changeFrequency: "daily",
			priority: 0.8,
		},
		{
			loc: `${baseUrl}/comparar`,
			changeFrequency: "weekly",
			priority: 0.6,
		},
		{
			loc: `${baseUrl}/bairros`,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			loc: `${baseUrl}/incorporadoras`,
			changeFrequency: "weekly",
			priority: 0.7,
		},
		...incorporadoras.map((i) => ({
			loc: `${baseUrl}/incorporadora/${i.slug}`,
			changeFrequency: "weekly",
			priority: 0.7,
		})),
		...bairros.map((b) => ({
			loc: `${baseUrl}/bairro/${b.slug}`,
			changeFrequency: "weekly",
			priority: 0.8,
		})),
		{
			loc: `${baseUrl}/blogs`,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			loc: `${baseUrl}/sobre`,
			changeFrequency: "yearly",
			priority: 0.6,
		},
		{
			loc: `${baseUrl}/contato`,
			changeFrequency: "yearly",
			priority: 0.8,
		},
		{
			loc: `${baseUrl}/perguntas-frequentes`,
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			loc: `${baseUrl}/politica-de-privacidade`,
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			loc: `${baseUrl}/termos-e-condicoes`,
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${urls
				.map(
					(url) =>
						`<url>
							<loc>${url.loc}</loc>
							<lastmod>${lastmodDe(
								SEM_CATALOGO.has(url.loc.replace(baseUrl, "")) ? null : ultimoImovel
							)}</lastmod>
							<changefreq>${url.changeFrequency}</changefreq>
							<priority>${url.priority.toFixed(1)}</priority>
						</url>`
				)
				.join("\n")}
		</urlset>`;

	return new NextResponse(body, {
		status: 200,
		headers: { "Content-Type": "application/xml" },
	});
}
