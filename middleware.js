import { NextResponse } from "next/server";

const restrictedRoutes = {
	"/aboutus": "/sobre",
	"/contactus": "/contato",
	"/properties": "/imoveis",
	"/property-detail": "/imovel",
	"/blog-detail": "/blog",
	"/faqs": "/perguntas-frequentes",
	"/privacy": "/politica-de-privacidade",
	"/terms": "/termos-e-condicoes",
	"/not-found": "/nao-encontrado",
};

export function middleware(request) {
	const url = request.nextUrl.clone();
	const pathname = url.pathname;

	for (const [englishRoute, portugueseRoute] of Object.entries(
		restrictedRoutes
	)) {
		if (pathname === englishRoute || pathname.startsWith(`${englishRoute}/`)) {
			if (pathname.startsWith(`${englishRoute}/`)) {
				const param = pathname.slice(englishRoute.length);
				url.pathname = `${portugueseRoute}${param}`;
			} else {
				url.pathname = portugueseRoute;
			}

			return NextResponse.redirect(url, 301);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/property-detail/:path*",
		"/blog-detail/:path*",
		"/aboutus",
		"/contactus",
		"/properties",
		"/property-detail",
		"/blog-detail",
		"/faqs",
		"/privacy",
		"/terms",
		"/not-found",
	],
};
