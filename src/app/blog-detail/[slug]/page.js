import BlogDetailClient from "./BlogDetailClient";

import { blogData as data } from "../../storage/data";

import { formatDateISO } from "../../helper/formatter";
import { getBaseUrl, getSiteName } from "../../helper/utils";

export async function generateMetadata({ params }) {
	const blogPost = data.find((item) => item.slug === params.slug);

	if (!blogPost) {
		return {
			title: "Artigo não encontrado",
			description: "O artigo que você está procurando não foi encontrado.",
		};
	}

	return {
		title: `${blogPost.title} | ${getSiteName()}`,
		description: blogPost.desc,
		keywords: blogPost.keywords,
		openGraph: {
			title: blogPost.title,
			description: blogPost.desc,
			type: "article",
			publishedTime: formatDateISO(blogPost.date),
			authors: [blogPost.author],
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
