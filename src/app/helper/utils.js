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
		/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
	const match = url.match(regex);
	return match ? match[1] : null;
}
