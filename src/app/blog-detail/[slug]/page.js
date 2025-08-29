import { notFound } from "next/navigation";

import BlogDetailClient from "./BlogDetailClient";

import prisma from "../../../db/prisma";

import { formatDateISO } from "../../helper/Formatter";
import { getBaseUrl, getSiteName } from "../../helper/Utils";

export async function generateMetadata({ params }) {
	const blogPost = await prisma.blog.findUnique({
		where: {
			slug: params.slug,
			OR: [{ thumbnail: { not: "" } }, { image: { not: "" } }],
		},
	});

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
			description: blogPost.description,
			url: `${getBaseUrl()}/blog/${blogPost.slug}`,
			type: "article",
			article: {
				publishedTime: formatDateISO(blogPost.createdAt),
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
			description: blogPost.description,
			images: [`${getBaseUrl()}${blogPost.image}`],
		},
		alternates: {
			canonical: `${getBaseUrl()}/blog/${blogPost.slug}`,
		},
	};
}

export default async function BlogDetail({ params }) {
	const blogPost = await prisma.blog.findUnique({
		include: {
			content: true,
		},
		where: {
			slug: params.slug,
			OR: [{ thumbnail: { not: "" } }, { image: { not: "" } }],
		},
	});

	if (!blogPost) {
		notFound();
	}

	/** Recent Posts */
	const recentPosts = await prisma.blog.findMany({
		where: {
			OR: [{ thumbnail: { not: "" } }, { image: { not: "" } }],
		},
		orderBy: {
			createdAt: "desc",
		},
		take: 3,
	});

	/** Related Posts the same tags */
	const relatedPosts = await prisma.blog.findMany({
		where: {
			slug: { not: params.slug },
			tag: blogPost.tag,
			OR: [{ thumbnail: { not: "" } }, { image: { not: "" } }],
		},
		take: 2,
	});

	/** Tags available */
	const tagsQuery = await prisma.blog.findMany({
		select: {
			tag: true,
		},
		distinct: ["tag"],
		where: {
			tag: {
				not: "",
			},
		},
	});

	const tags = tagsQuery.map((item) => item.tag);

	return (
		<BlogDetailClient
			blogPost={blogPost}
			recentPosts={recentPosts}
			relatedPosts={relatedPosts}
			tags={tags}
		/>
	);
}
