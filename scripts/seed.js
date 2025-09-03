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
				external_id: property.external_id,
				slug: property.slug,
				name: property.name,
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
				release_in: property.release_in,
				book: property.book,
				video: property.video,
				description: property.description,
				attributes: property.attributes,
				description_embed: property.description_embed,
				preview: property.preview,
				seo: property.seo,
				typelogies: property.typelogies,
				images: {
					create: [
						{
							src: property.image,
							title: "Imagem de capa",
							type: "perspectives",
							thumbnail: true,
						},
						...property.images,
					].map((img, index) => ({
						src: img.src,
						alt: img.title,
						type: img.type || "perspectives",
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
