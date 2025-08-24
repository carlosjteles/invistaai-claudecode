import BlogDetailClient from "./BlogDetailClient";

import { blogData as data } from "../../storage/data";

import { formatDateISO } from "../../helper/Formatter";
import { getBaseUrl, getSiteName } from "../../helper/Utils";

export async function generateMetadata({ params }) {
	const blogPost = data.find((item) => item.slug === params.slug);

	if (!blogPost) {
		return {
			title: `Notícia não encontrada | ${getSiteName()}`,
			description:
				"O artigo que você está procurando não existe ou foi removido.",
		};
	}

	return {
		title: `${blogPost.title} | ${getSiteName()}`,
		description: blogPost.desc,
		keywords: blogPost.keywords,
		openGraph: {
			title: blogPost.title,
			description: blogPost.desc,
			url: `${getBaseUrl()}/blog/${blogPost.slug}`,
			type: "article",
			article: {
				publishedTime: formatDateISO(blogPost.date),
				section: blogPost.tag,
				authors: [blogPost.author],
			},
			images: [
				{
					url: `${getBaseUrl()}${blogPost.image}`,
					width: 1200,
					height: 630,
					alt: blogPost.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: blogPost.title,
			description: blogPost.desc,
			images: [`${getBaseUrl()}${blogPost.image}`],
		},
		alternates: {
			canonical: `${getBaseUrl()}/blog/${blogPost.slug}`,
		},
	};
}

export default function BlogDetail(props) {
	return <BlogDetailClient {...props} />;
}
