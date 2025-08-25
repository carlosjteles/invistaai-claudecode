const { PrismaClient } = require("@prisma/client");
const { blogData, propertyData } = require("../src/app/storage/data");

const prisma = new PrismaClient();

async function main() {
	for (const blog of blogData) {
		await prisma.blog.create({
			data: {
				slug: blog.slug,
				image: blog.image,
				tag: blog.tag,
				author: blog.author,
				title: blog.title,
				desc: blog.desc,
				date: blog.date,
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

	for (const property of propertyData) {
		await prisma.property.create({
			data: {
				slug: property.slug,
				image: property.image,
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
					create: property.images.map((img, index) => ({
						src: img.src,
						title: img.title,
						alt: img.title,
						order: index,
					})),
				},
			},
		});
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
