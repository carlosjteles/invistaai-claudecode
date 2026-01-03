import { NextResponse } from "next/server";

import prisma from "../../db/prisma";

import { getBaseUrl } from "../helper/utils";

export const revalidate = 300;

export async function GET() {
	const baseUrl = getBaseUrl();

	const properties = await prisma.property.findMany({
		select: { slug: true, updatedAt: true },
		orderBy: { updatedAt: "desc" },
	});

	const body = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${properties
							.map(
								(property) =>
									`<url>
										<loc>${baseUrl}/imovel/${property.slug}</loc>
										<lastmod>${property.updatedAt.toISOString()}</lastmod>
										<changefreq>monthly</changefreq>
										<priority>0.8</priority>
									</url>`
							)
							.join("\n")}
        </urlset>`;

	return new NextResponse(body, {
		status: 200,
		headers: { "Content-Type": "application/xml" },
	});
}
