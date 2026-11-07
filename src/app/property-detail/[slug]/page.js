import { notFound, permanentRedirect } from "next/navigation";

import PropertyDetailsClient from "./PropertyDetailsClient";

import { tituloImovel } from "../../helper/schema";
import { categories } from "../../storage/filters";

import prisma from "../../../db/prisma";

import { getBaseUrl, getSiteName, ordenarPorEntrega } from "../../helper/utils";

export const revalidate = 300;

export async function generateMetadata({ params }) {
	try {
		const propertyData = await prisma.property.findUnique({
			where: { slug: params.slug },
			select: {
				id: true,
				name: true,
				address: true,
				neighborhood: true,
				category: true,
				preview: true,
				seo: true,
				slug: true,
				images: {
					where: { thumbnail: true },
					take: 1,
					select: {
						src: true,
						alt: true,
					},
				},
				_count: { select: { images: true } },
			},
		});

		if (!propertyData) {
			return {
				title: `Imóvel não encontrado | ${getSiteName()}`,
				description: "O imóvel que você está procurando não foi encontrado.",
			};
		}

		const category =
			categories.find((cat) => cat.id === propertyData.category)?.label || "";

		// Título montado a partir dos dados: nome, metragem e bairro cabem em 60 caracteres.
		const tituloPagina = tituloImovel({
			nome: propertyData.name || propertyData.address,
			dev: propertyData.seo?.developer,
			area: propertyData.preview?.area,
			dorms: propertyData.preview?.bedroom,
			bairro: propertyData.neighborhood,
		});

		const mainImage =
			propertyData.images && propertyData.images.length > 0
				? propertyData.images[0].src
				: undefined;

		return {
			title: tituloPagina,
			description:
				propertyData.seo?.description ||
				`${propertyData.preview?.area} com ${propertyData.preview?.bedroom} em ${propertyData.neighborhood}`,
			keywords:
				propertyData.seo?.keywords ||
				`imóvel, ${category}, ${propertyData.neighborhood}`,
			openGraph: {
				title: tituloPagina,
				description: propertyData.seo?.description,
				type: "article",
				url: `${getBaseUrl()}/imovel/${propertyData.slug}`,
				images: mainImage
					? [
							{
								url: mainImage,
								width: 1200,
								height: 630,
								alt: propertyData.name || propertyData.address,
							},
					  ]
					: [],
			},
			twitter: {
				card: "summary_large_image",
				title: tituloPagina,
				description: propertyData.seo?.description,
				images: mainImage ? [mainImage] : [],
			},
			alternates: {
				canonical: `${getBaseUrl()}/imovel/${propertyData.slug}`,
			},
			// Sem fotos ainda (aguardando a fila): não indexar até as fotos chegarem
			robots: {
				index: (propertyData._count?.images || 0) > 0,
				follow: true,
				"max-snippet": -1,
				"max-image-preview": "large",
			},
		};
	} catch (error) {
		return {
			title: `Imóvel | ${getSiteName()}`,
			description: "Confira as melhores oportunidades de imóveis.",
		};
	}
}

async function getRedirect(slug) {
	try {
		const rows = await prisma.$queryRaw`
			select destino from conteudo.redirecionamentos where origem = ${`/imovel/${slug}`} limit 1`;
		return rows[0]?.destino || null;
	} catch (e) {
		return null;
	}
}

async function getBairro(neighborhood) {
	if (!neighborhood) return null;
	try {
		const rows = await prisma.$queryRaw`
			select slug, nome, prep from conteudo.bairros where ativo and ${neighborhood} = any(bairros) order by ordem limit 1`;
		return rows[0] || null;
	} catch (e) {
		return null;
	}
}

async function getIncorporadora(nome) {
	if (!nome) return null;
	try {
		const rows = await prisma.$queryRaw`
			select slug, nome from conteudo.incorporadoras where ativo and nome = ${nome} limit 1`;
		return rows[0] || null;
	} catch (e) {
		return null;
	}
}

async function getHistorico(id) {
	try {
		return await prisma.$queryRaw`
			select to_char(data, 'YYYY-MM-DD') data, preco::float8 preco
			from conteudo.historico_preco where property_id = ${id} order by data`;
	} catch (e) {
		return [];
	}
}

async function getTabelaEm(externalId) {
	if (!externalId) return null;
	try {
		const rows = await prisma.$queryRaw`
			select dados->>'tabela_atualizada_em' t from orulo.buildings where orulo_id = ${externalId} limit 1`;
		const t = rows[0]?.t;
		return /^\d{2}\/\d{2}\/\d{4}$/.test(t || "") ? t : null;
	} catch (e) {
		return null;
	}
}

async function getTipos(id) {
	try {
		const [r] = await prisma.$queryRaw`select conteudo.tipos_do_imovel(p) tipos from "Property" p where p.id = ${id}`;
		return r?.tipos || [];
	} catch (e) {
		return [];
	}
}

async function getAnaliseRenda(id) {
	try {
		const [r] = await prisma.$queryRaw`select conteudo.analise_renda(${id}::int) a`;
		return r?.a || null;
	} catch (e) {
		return null;
	}
}

async function getBairrosAlerta() {
	try {
		return await prisma.$queryRaw`
			select slug, nome, bairros, coalesce(extras, '{}') extras from conteudo.bairros where ativo order by ordem`;
	} catch (e) {
		return [];
	}
}

export default async function PropertyDetails({ params }) {
	const propertyData = await prisma.property.findUnique({
		where: { slug: params.slug },
		include: {
			images: {
				where: {
					OR: [
						{ type: "perspectives", thumbnail: false },
						{ NOT: { type: "perspectives" } },
					],
				},
			},
		},
	});

	// Se a única foto for a capa (perspectiva marcada como thumbnail), usa ela na galeria
	if (propertyData && propertyData.images.length === 0) {
		propertyData.images = await prisma.propertyImage.findMany({ where: { propertyId: propertyData.id } });
	}

	if (!propertyData) {
		// Imóvel removido: redireciona (308) para a página do bairro ou para /imoveis
		const destino = await getRedirect(params.slug);
		if (destino) permanentRedirect(destino);
		notFound();
	}

	const [bairro, incorporadora, historico, tabelaEm, bairrosAlerta, tipos] = await Promise.all([
		getBairro(propertyData.neighborhood),
		getIncorporadora(propertyData.seo?.developer),
		getHistorico(propertyData.id),
		getTabelaEm(propertyData.external_id),
		getBairrosAlerta(),
		getTipos(propertyData.id),
	]);
	// Metrô, polos de demanda e preço do m² do bairro: vale para todo imóvel.
	const analise = await getAnaliseRenda(propertyData.id);
	// Studios, lofts e NR ganham também a leitura de rentabilidade.
	const ehRenda = tipos.some((t) => ["studio", "loft", "nr"].includes(t));
	const analiseRenda = ehRenda ? analise : null;

	// Bairro do imóvel já marcado no alerta
	const bairroDoImovel = bairrosAlerta.find(
		(b) => b.bairros.includes(propertyData.neighborhood) || b.extras.includes(propertyData.slug)
	);

	const relatedInclude = {
		images: {
			select: {
				id: true,
				src: true,
				alt: true,
			},
			where: {
				thumbnail: true,
			},
			take: 1,
		},
	};

	/** 1º: mesmo bairro; depois: faixa de preço parecida, para completar 6 */
	const relatedProperties = await prisma.property.findMany({
		where: {
			images: { some: {} },
			slug: { not: params.slug },
			neighborhood: propertyData.neighborhood,
		},
		include: relatedInclude,
		orderBy: { updatedAt: "desc" },
		take: 6,
	});

	if (relatedProperties.length < 6 && propertyData.price > 0) {
		const moreProperties = await prisma.property.findMany({
			where: {
				images: { some: {} },
				slug: {
					notIn: [params.slug, ...relatedProperties.map((item) => item.slug)],
				},
				price: {
					gte: propertyData.price * 0.6,
					lte: propertyData.price * 1.4,
				},
			},
			include: relatedInclude,
			orderBy: { updatedAt: "desc" },
			take: 6 - relatedProperties.length,
		});

		relatedProperties.push(...moreProperties);
	}

	return (
		<PropertyDetailsClient
			propertyData={propertyData}
			relatedProperties={ordenarPorEntrega(relatedProperties)}
			bairro={bairro}
			incorporadora={incorporadora}
			historico={historico}
			tabelaEm={tabelaEm}
			bairrosAlerta={bairrosAlerta.map((b) => ({ slug: b.slug, nome: b.nome }))}
			bairroAlerta={bairroDoImovel?.slug || null}
			tipos={tipos}
			analiseRenda={analiseRenda}
			analise={analise}
			updatedLabel={new Date(propertyData.updatedAt).toLocaleDateString(
				"pt-BR",
				{ timeZone: "America/Sao_Paulo" }
			)}
			publishedISO={new Date(propertyData.createdAt).toISOString()}
			modifiedISO={new Date(propertyData.updatedAt).toISOString()}
		/>
	);
}
