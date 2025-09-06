import { NextResponse } from "next/server";

import prisma from "../../../db/prisma";

import { z as validate } from "zod";

import { verifyToken } from "../../api/helper/auth";

const ImageSchema = validate.object({
	src: validate.string(),
	title: validate.string().optional(),
	thumbnail: validate.boolean().optional(),
	type: validate.enum(["perspectives", "building_documents"]),
});

const PreviewSchema = validate.object({
	area: validate.string().min(1, "A área é obrigatória"),
	bedroom: validate
		.string()
		.min(1, "Informação sobre dormitórios é obrigatória"),
	suite: validate.string().min(1, "Informação sobre suítes é obrigatória"),
	parking: validate.string().min(1, "Informação sobre vagas é obrigatória"),
});

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

const TypologySchema = validate.object({
	type: validate.string(),
	private_area: validate.number(),
	bedrooms: validate.number(),
	bathrooms: validate.number(),
	suites: validate.number(),
	parking: validate.number(),
	price: validate.number(),
});

const PropertySchema = validate.object({
	external_id: validate.string().min(1, "O ID externo é obrigatório"),
	slug: validate
		.string()
		.min(1, "O slug é obrigatório")
		.regex(
			/^[a-z0-9-]+$/,
			"Slug deve conter apenas letras minúsculas, números e hífens"
		),
	name: validate.string().min(1, "O nome é obrigatório"),
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
	release_in: validate.string().min(1, "A data de lançamento é obrigatória"),
	video: validate
		.string()
		.url("A URL do vídeo é inválida")
		.optional()
		.nullable(),
	book: validate.string().url("A URL do book é inválida").optional().nullable(),
	attributes: validate.array(validate.string()).optional(),
	typelogies: validate.array(TypologySchema).optional(),
	description: validate
		.array(validate.string())
		.min(1, "É necessário pelo menos um parágrafo de descrição"),
	description_embed: validate
		.string()
		.url("A URL do embed é inválida")
		.optional()
		.nullable(),
	seo: SeoSchema,
	preview: PreviewSchema,
	typelogies: validate.array(TypologySchema).optional(),
	images: validate
		.array(ImageSchema)
		.min(1, "É necessário pelo menos uma imagem"),
});

const PropertyUpdateSchema = validate.object({
	slug: validate
		.string()
		.min(1, "O slug é obrigatório")
		.regex(
			/^[a-z0-9-]+$/,
			"Slug deve conter apenas letras minúsculas, números e hífens"
		)
		.optional(),
	name: validate.string().min(1, "O nome é obrigatório").optional(),
	address: validate.string().min(1, "O endereço é obrigatório").optional(),
	neighborhood: validate.string().min(1, "O bairro é obrigatório").optional(),
	bedroom: validate
		.array(validate.union([validate.number(), validate.string()]))
		.min(1, "É necessário pelo menos um tipo de dormitório")
		.optional(),
	suite: validate
		.array(validate.number())
		.min(1, "É necessário pelo menos uma opção de suíte")
		.optional(),
	parking: validate
		.array(validate.number())
		.min(1, "É necessário pelo menos uma opção de vaga")
		.optional(),
	min_area: validate
		.number()
		.positive("A área mínima deve ser positiva")
		.optional(),
	price: validate.number().positive("O preço deve ser positivo").optional(),
	rating: validate.number().min(0).max(5).optional(),
	quantity_reviews: validate.number().int().nonnegative().optional(),
	category: validate
		.number()
		.int()
		.positive("A categoria é obrigatória")
		.optional(),
	delivery_in: validate
		.string()
		.min(1, "A data de entrega é obrigatória")
		.optional(),
	release_in: validate
		.string()
		.min(1, "A data de lançamento é obrigatória")
		.optional(),
	book: validate.string().url("A URL do book é inválida").optional().nullable(),
	attributes: validate.array(validate.string()).optional(),
	description: validate
		.array(validate.string())
		.min(1, "É necessário pelo menos um parágrafo de descrição")
		.optional(),
	description_embed: validate
		.string()
		.url("A URL do embed é inválida")
		.optional()
		.nullable(),
	video: validate
		.string()
		.url("A URL do vídeo é inválida")
		.optional()
		.nullable(),
	seo: SeoSchema.optional(),
	preview: PreviewSchema.optional(),
	typelogies: validate.array(TypologySchema).optional(),
	images: validate
		.array(ImageSchema)
		.min(1, "É necessário pelo menos uma imagem")
		.optional(),
});

export async function POST(request) {
	try {
		const tokenCheck = verifyToken(request);

		if (!tokenCheck.success) {
			return NextResponse.json(
				{ success: false, message: tokenCheck.message },
				{ status: tokenCheck.status }
			);
		}

		const body = await request.json();
		const validatedData = PropertySchema.parse(body);

		const result = await prisma.property.create({
			data: {
				external_id: validatedData.external_id,
				slug: validatedData.slug,
				name: validatedData.name,
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
				release_in: validatedData.release_in,
				video: validatedData.video,
				book: validatedData.book,
				attributes: validatedData.attributes,
				description: validatedData.description,
				description_embed: validatedData.description_embed,
				preview: validatedData.preview,
				seo: validatedData.seo,
				typelogies: validatedData.typelogies,
				images: {
					create: validatedData.images.map((img, index) => ({
						src: img.src,
						alt: img.title,
						order: index,
						type: img.type,
						thumbnail: img.thumbnail || false,
					})),
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
		const tokenCheck = verifyToken(request);

		if (!tokenCheck.success) {
			return NextResponse.json(
				{ success: false, message: tokenCheck.message },
				{ status: tokenCheck.status }
			);
		}

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

		const validatedData = PropertyUpdateSchema.parse(data);

		const existingProperty = await prisma.property.findUnique({
			where: { id: Number(id) },
			include: {
				images: true,
			},
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

		const updateData = {};

		Object.keys(validatedData).forEach((key) => {
			if (key !== "images") {
				updateData[key] = validatedData[key];
			}
		});

		const updatedProperty = await prisma.$transaction(async (tx) => {
			const property = await tx.property.update({
				where: { id: Number(id) },
				data: updateData,
			});

			if (validatedData.images) {
				await tx.propertyImage.deleteMany({
					where: { property_id: Number(id) },
				});

				await tx.propertyImage.createMany({
					data: validatedData.images.map((img, index) => ({
						property_id: Number(id),
						src: img.src,
						alt: img.title,
						order: index,
						type: img.type,
						thumbnail: img.thumbnail || false,
					})),
				});
			}

			return property;
		});

		return NextResponse.json({
			success: true,
			message: "Propriedade atualizada com sucesso",
			data: { id: updatedProperty.id },
		});
	} catch (error) {
		console.error("Erro ao atualizar propriedade:", error);

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
				message: "Erro ao atualizar propriedade",
			},
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
