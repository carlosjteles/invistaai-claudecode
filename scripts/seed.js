const { PrismaClient } = require("../src/generated/prisma/index.js");

const blogData = require("./blog/data.js");
const propertyData = require("./properties/data.js");

async function main() {
	await prisma.blog.deleteMany();

	for (const blog of blogData) {
		await prisma.blog.create({
			data: {
				slug: blog.slug,
				thumbnail: blog.image,
				image: blog.image,
				tag: blog.tag,
				author: blog.author,
				title: blog.title,
				description: blog.desc,
				keywords: blog.keywords || [],
				content: {
					create: blog.content.map((item, index) => ({
						type: item.type,
						value: item.value,
						author: item.author || null,
						href: item.href || null,
						order: index,
					})),
				},
			},
		});
	}

	await prisma.property.deleteMany();

	for (const property of propertyData) {
		await prisma.property.create({
			data: {
				slug: property.slug,
				address: property.address,
				neighborhood: property.neighborhood,
				bedroom: property.bedroom,
				suite: property.suite,
				parking: property.parking,
				min_area: property.min_area,
				price: property.price,
				rating: property.rating,
				quantity_reviews: property.quantity_reviews,
				category: property.category,
				delivery_in: property.delivery_in,
				book: property.book,
				description: property.description,
				description_embed: property.description_embed,
				preview: property.preview,
				seo: {
					create: {
						title: property.seo.title,
						description: property.seo.description,
						keywords: property.seo.keywords,
						city: property.seo.city,
						state: property.seo.state,
						zip: property.seo.zip,
						street: property.seo.street,
					},
				},
				images: {
					create: [
						{
							src: property.image,
							title: "Imagem de capa",
							thumbnail: true,
						},
						...property.images,
					].map((img, index) => ({
						src: img.src,
						alt: img.title,
						order: index,
						thumbnail: img.thumbnail || false,
					})),
				},
			},
		});
	}
}

const prisma = new PrismaClient();

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
