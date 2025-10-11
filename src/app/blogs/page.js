import BlogsClient from "./BlogsClient";

import prisma from "../../db/prisma";

import { getBaseUrl, getSiteName } from "../helper/utils";

export const revalidate = 300;

export const metadata = {
	title: `Blog e Notícias sobre Imóveis em São Paulo | ${getSiteName()}`,
	description:
		"Conteúdo especializado sobre mercado imobiliário, dicas para investidores e tendências para quem quer comprar imóvel em São Paulo.",
	keywords: [
		"blog imobiliário",
		"notícias imóveis",
		"mercado imobiliário São Paulo",
		"dicas compra de imóvel",
		"investimento imobiliário",
	],
	openGraph: {
		title: `Blog Imobiliário | ${getSiteName()}`,
		description:
			"Conteúdo especializado sobre mercado imobiliário e dicas para investidores.",
		url: `${getBaseUrl()}/blogs`,
		type: "website",
		images: [
			{
				url: `${getBaseUrl()}/images/bg/blogs.webp`,
				width: 1200,
				height: 630,
				alt: "Blog Imobiliário",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: `Blog Imobiliário | ${getSiteName()}`,
		description:
			"Conteúdo especializado sobre mercado imobiliário e dicas para investidores.",
		images: [`${getBaseUrl()}/images/bg/blogs.webp`],
	},
	alternates: {
		canonical: `${getBaseUrl()}/blogs`,
	},
	robots: {
		index: true,
		follow: true,
		nocache: false,
		"max-image-preview": "large",
		"max-snippet": -1,
	},
};

export default async function Blogs({ searchParams }) {
	/** Set pagination parameters */
	const page = Number(searchParams.page) || 1;
	const itemsPerPage = 8;

	/** Set filter parameters */
	const tag = searchParams.tag || null;
	const searchTerm = searchParams.q || null;

	/** Set filters prisma */
	const filterWhere = {};
	filterWhere.OR = [{ thumbnail: { not: "" } }, { image: { not: "" } }];

	if (tag) {
		filterWhere.tag = {
			equals: tag,
			mode: "insensitive",
		};
	}

	if (searchTerm) {
		filterWhere.OR = [
			{ title: { contains: searchTerm, mode: "insensitive" } },
			{ description: { contains: searchTerm, mode: "insensitive" } },
		];
	}

	const blogs = await prisma.blog.findMany({
		where: filterWhere,
		include: {
			content: true,
		},
		orderBy: {
			createdAt: "desc",
		},
		skip: (page - 1) * itemsPerPage,
		take: itemsPerPage,
	});

	/** Total pages */
	const totalCount = await prisma.blog.count({ where: filterWhere });
	const totalPages = Math.ceil(totalCount / itemsPerPage);

	/** Recent blogs */
	const recentBlogs = await prisma.blog.findMany({
		where: {
			OR: [{ thumbnail: { not: "" } }, { image: { not: "" } }],
		},
		orderBy: {
			createdAt: "desc",
		},
		take: 3,
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
		<BlogsClient
			blogs={blogs}
			recentBlogs={recentBlogs}
			tags={tags}
			totalPages={totalPages}
			currentPage={page}
			totalCount={totalCount}
			searchParams={searchParams}
		/>
	);
}
