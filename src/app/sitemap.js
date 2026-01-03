import { getBaseUrl } from "./helper/utils";

export const revalidate = 300;

export default async function sitemap() {
	const baseUrl = getBaseUrl();

	const today = new Date();

	return [
		{
			url: `${baseUrl}/sitemap-static.xml`,
			lastModified: today,
			changeFrequency: "yearly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/sitemap-imoveis.xml`,
			lastModified: today,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/sitemap-blogs.xml`,
			lastModified: today,
			changeFrequency: "monthly",
			priority: 0.6,
		},
	];
}
