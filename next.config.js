/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
	reactStrictMode: false,
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
	},
	webpack(config) {
		config.module.rules.forEach((rule) => {
			const { oneOf } = rule;
			if (oneOf) {
				oneOf.forEach((one) => {
					if (!`${one.issuer?.and}`.includes("_app")) return;
					one.issuer.and = [path.resolve(__dirname)];
				});
			}
		});
		return config;
	},

	async rewrites() {
		return [
			{
				source: "/contato",
				destination: "/contactus",
			},
			{
				source: "/imoveis",
				destination: "/properties",
			},
			{
				source: "/imovel/:slug",
				destination: "/property-detail/:slug",
			},
			{
				source: "/lancamentos",
				destination: "/properties",
			},
			{
				source: "/blog/:slug",
				destination: "/blog-detail/:slug",
			},
			{
				source: "/sobre",
				destination: "/aboutus",
			},
			{
				source: "/perguntas-frequentes",
				destination: "/faqs",
			},
			{
				source: "/politica-de-privacidade",
				destination: "/privacy",
			},
			{
				source: "/termos-e-condicoes",
				destination: "/terms",
			},
			{
				source: "/nao-encontrado",
				destination: "/not-found",
			},
		];
	},
};

module.exports = nextConfig;
