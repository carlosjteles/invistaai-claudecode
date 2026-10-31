import { NextResponse } from "next/server";

import { getBaseUrl } from "../helper/utils";

export const revalidate = 300;

export async function GET() {
	const baseUrl = getBaseUrl();

	const today = new Date().toISOString();

	const sitemaps = ["sitemap-static.xml", "sitemap-imoveis.xml", "sitemap-blogs.xml"];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
	.map(
		(file) => `	<sitemap>
		<loc>${baseUrl}/${file}</loc>
		<lastmod>${today}</lastmod>
	</sitemap>`
	)
	.join("\n")}
</sitemapindex>`;

	return new NextResponse(body, {
		status: 200,
		headers: { "Content-Type": "application/xml" },
	});
}
