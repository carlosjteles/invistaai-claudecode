import prisma from "../db/prisma";

import { getBaseUrl } from "./helper/utils";

export const revalidate = 300;

export default async function sitemap() {
	const baseUrl = getBaseUrl();

	const properties = await prisma.property.findMany({
		select: { slug: true, updatedAt: true },
		orderBy: {
			updatedAt: "desc",
		},
	});

	const blogs = await prisma.blog.findMany({
		select: { slug: true, updatedAt: true },
		orderBy: {
			updatedAt: "desc",
		},
	});

	const staticPages = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 1.0,
		},
		{
			url: `${baseUrl}/imoveis`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/lancamentos`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/blogs`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/sobre`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/contato`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/perguntas-frequentes`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: `${baseUrl}/politica-de-privacidade`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${baseUrl}/termos-e-condicoes`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];

	const propertyPages = properties.map((property) => ({
		url: `${baseUrl}/imovel/${property.slug}`,
		lastModified: property.updatedAt,
		changeFrequency: "monthly",
		priority: 0.8,
	}));

	const blogPages = blogs.map((blog) => ({
		url: `${baseUrl}/blog/${blog.slug}`,
		lastModified: blog.updatedAt,
		changeFrequency: "monthly",
		priority: 0.6,
	}));

	return [...staticPages, ...propertyPages, ...blogPages];
}
