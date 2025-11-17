import { NextResponse } from "next/server";

import prisma from "../../../db/prisma";

import { z as validate } from "zod";

import { verifyToken } from "../../api/helper/auth";

export const revalidate = 300;

const BlogContentSchema = validate.object({
	type: validate.enum(["text", "quote", "link", "title"], {
		errorMap: () => ({
			message: "Tipo deve ser 'text', 'quote', 'link' ou 'title'",
		}),
	}),
	value: validate.string().min(1, "O valor do conteúdo é obrigatório"),
	author: validate.string().optional().nullable(),
	href: validate.string().url("A URL é inválida").optional().nullable(),
});

const BlogSchema = validate.object({
	slug: validate
		.string()
		.min(1, "O slug é obrigatório")
		.regex(
			/^[a-z0-9-]+$/,
			"Slug deve conter apenas letras minúsculas, números e hífens"
		),
	image: validate.string().min(1, "A URL da imagem é obrigatória"),
	thumbnail: validate.string().min(1, "A URL da thumbnail é obrigatória"),
	tag: validate.string().min(1, "A tag é obrigatória"),
	author: validate.string().min(1, "O autor é obrigatório"),
	title: validate.string().min(1, "O título é obrigatório"),
	description: validate.string().min(1, "A descrição é obrigatória"),
	keywords: validate
		.array(validate.string())
		.min(1, "É necessário pelo menos uma palavra-chave"),
	content: validate
		.array(BlogContentSchema)
		.min(1, "É necessário pelo menos um item de conteúdo"),
});

export async function POST(request) {
	const tokenCheck = verifyToken(request);

	if (!tokenCheck.success) {
		return NextResponse.json(
			{ success: false, message: tokenCheck.message },
			{ status: tokenCheck.status }
		);
	}

	try {
		const body = await request.json();

		const validatedData = BlogSchema.parse(body);

		const result = await prisma.$transaction(async (tx) => {
			const blog = await tx.blog.create({
				data: {
					slug: validatedData.slug,
					thumbnail: validatedData.thumbnail,
					image: validatedData.image,
					tag: validatedData.tag,
					author: validatedData.author,
					title: validatedData.title,
					description: validatedData.description,
					keywords: validatedData.keywords,
				},
			});

			await tx.blogContent.createMany({
				data: validatedData.content.map((item, index) => ({
					blogId: blog.id,
					type: item.type,
					value: item.value,
					author: item.author || null,
					href: item.href || null,
					order: index,
				})),
			});

			return blog;
		});

		return NextResponse.json(
			{
				success: true,
				message: "Blog criado com sucesso",
				data: { id: result.id },
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Erro ao criar blog:", error);

		if (error instanceof validate.ZodError) {
			const formattedErrors = error.errors.map((err) => ({
				path: err.path.join("."),
				message: err.message,
			}));

			return NextResponse.json(
				{
					success: false,
					message: "Erro de validação",
					errors: formattedErrors,
				},
				{ status: 400 }
			);
		}

		if (error.code === "P2002") {
			return NextResponse.json(
				{
					success: false,
					message: "Já existe um blog com este slug",
					field: error.meta?.target?.[0] || "slug",
				},
				{ status: 409 }
			);
		}

		return NextResponse.json(
			{
				success: false,
				message: "Erro interno do servidor",
			},
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
