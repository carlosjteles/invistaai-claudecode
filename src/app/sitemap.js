import { getBaseUrl } from "./helper/Utils";

export default async function sitemap() {
	const properties = await prisma.property.findMany({
		select: { slug: true, updatedAt: true },
	});

	const blogs = await prisma.blog.findMany({
		select: { slug: true, updatedAt: true },
	});

	const staticPages = [
		{ url: getBaseUrl(), lastModified: new Date() },
		{ url: `${getBaseUrl()}/imoveis`, lastModified: new Date() },
		{ url: `${getBaseUrl()}/sobre`, lastModified: new Date() },
		{ url: `${getBaseUrl()}/contato`, lastModified: new Date() },
		{ url: `${getBaseUrl()}/blog`, lastModified: new Date() },
	];

	// Transformar propriedades em URLs
	const dynamicPropertiesPages = properties.map((property) => ({
		url: `${getBaseUrl()}/imovel/${property.slug}`,
		lastModified: property.updatedAt,
	}));

	const dynamicBlogPages = blogs.map((blog) => ({
		url: `${getBaseUrl()}/blog/${blog.slug}`,
		lastModified: blog.updatedAt,
	}));

	return [...staticPages, ...dynamicPropertiesPages, ...dynamicBlogPages];
}
