import { NextResponse } from "next/server";

import prisma from "../../../db/prisma";

import { z as validate } from "zod";

const SeoSchema = validate.object({
	title: validate.string().min(1, "O título SEO é obrigatório"),
	description: validate.string().min(1, "A descrição SEO é obrigatória"),
	keywords: validate
		.array(validate.string())
		.min(1, "É necessário pelo menos uma palavra-chave"),
	city: validate.string().min(1, "A cidade é obrigatória"),
	state: validate.string().length(2, "O estado deve ter 2 caracteres"),
	zip: validate.string().min(1, "O CEP é obrigatório"),
	street: validate.string().min(1, "O endereço é obrigatório"),
});

const PreviewSchema = validate.object({
	area: validate.string().min(1, "A área é obrigatória"),
	bedroom: validate
		.string()
		.min(1, "Informação sobre dormitórios é obrigatória"),
	suite: validate.string().min(1, "Informação sobre suítes é obrigatória"),
	parking: validate.string().min(1, "Informação sobre vagas é obrigatória"),
});

const PropertySchema = validate.object({
	slug: validate
		.string()
		.min(1, "O slug é obrigatório")
		.regex(
			/^[a-z0-9-]+$/,
			"Slug deve conter apenas letras minúsculas, números e hífens"
		),
	address: validate.string().min(1, "O endereço é obrigatório"),
	neighborhood: validate.string().min(1, "O bairro é obrigatório"),
	bedroom: validate
		.array(validate.union([validate.number(), validate.string()]))
		.min(1, "É necessário pelo menos um tipo de dormitório"),
	suite: validate
		.array(validate.number())
		.min(1, "É necessário pelo menos uma opção de suíte"),
	parking: validate
		.array(validate.number())
		.min(1, "É necessário pelo menos uma opção de vaga"),
	min_area: validate.number().positive("A área mínima deve ser positiva"),
	price: validate.number().positive("O preço deve ser positivo"),
	rating: validate.number().min(0).max(5).optional(),
	quantity_reviews: validate.number().int().nonnegative().optional(),
	category: validate.number().int().positive("A categoria é obrigatória"),
	delivery_in: validate.string().min(1, "A data de entrega é obrigatória"),
	book: validate.string().url("A URL do book é inválida").optional().nullable(),
	description: z
		.array(validate.string())
		.min(1, "É necessário pelo menos um parágrafo de descrição"),
	description_embed: z
		.string()
		.url("A URL do embed é inválida")
		.optional()
		.nullable(),
	seo: SeoSchema,
	preview: PreviewSchema,
});

export async function POST(request) {
	try {
		const body = await request.json();
		const validatedData = PropertySchema.parse(body);

		const result = await prisma.property.create({
			data: {
				slug: validatedData.slug,
				address: validatedData.address,
				neighborhood: validatedData.neighborhood,
				bedroom: validatedData.bedroom,
				suite: validatedData.suite,
				parking: validatedData.parking,
				min_area: validatedData.min_area,
				price: validatedData.price,
				rating: validatedData.rating,
				quantity_reviews: validatedData.quantity_reviews,
				category: validatedData.category,
				delivery_in: validatedData.delivery_in,
				book: validatedData.book,
				description: validatedData.description,
				description_embed: validatedData.description_embed,
				preview: validatedData.preview,
				seo: {
					create: {
						title: validatedData.seo.title,
						description: validatedData.seo.description,
						keywords: validatedData.seo.keywords,
						city: validatedData.seo.city,
						state: validatedData.seo.state,
						zip: validatedData.seo.zip,
						street: validatedData.seo.street,
					},
				},
			},
		});

		return NextResponse.json(
			{
				success: true,
				message: "Propriedade criada com sucesso",
				data: { id: result.id },
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Erro ao processar a requisição:", error);

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
					message: "Já existe uma propriedade com este slug",
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

export async function PUT(request) {
	try {
		const body = await request.json();
		const { id, ...data } = body;

		if (!id) {
			return NextResponse.json(
				{
					success: false,
					message: "ID da propriedade é obrigatório",
				},
				{ status: 400 }
			);
		}

		const validatedData = PropertySchema.parse(data);

		const existingProperty = await prisma.property.findUnique({
			where: { id: Number(id) },
		});

		if (!existingProperty) {
			return NextResponse.json(
				{
					success: false,
					message: "Propriedade não encontrada",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Propriedade atualizada com sucesso",
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: "Erro ao processar a requisição",
			},
			{ status: 500 }
		);
	}
}
