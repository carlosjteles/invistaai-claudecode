export function getBaseUrl() {
	if (process.env.NEXT_PUBLIC_BASE_URL) {
		return process.env.NEXT_PUBLIC_BASE_URL;
	}

	if (process.env.NODE_ENV === "development") {
		return "http://localhost:3000";
	}

	return "https://www.invistaai.com";
}

export function getSiteName() {
	return process.env.NEXT_PUBLIC_NAME || "InvistaAi";
}

export function getVideoId(url) {
	const regex =
		/(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:shorts\/|live\/|[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
	const match = url.match(regex);
	return match ? match[1] : null;
}

/** "30/04/2028" -> 20280430 (0 se não tiver data). */
export const numeroEntrega = (d) => {
	const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d || "");
	return m ? Number(`${m[3]}${m[2]}${m[1]}`) : 0;
};

/** Ordena imóveis pela entrega mais distante primeiro (prontos por último); empate: maior preço. */
export const ordenarPorEntrega = (lista) =>
	[...lista].sort(
		(a, b) => numeroEntrega(b.delivery_in) - numeroEntrega(a.delivery_in) || (b.price || 0) - (a.price || 0)
	);
