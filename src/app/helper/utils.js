export function getBaseUrl() {
	if (process.env.NEXT_PUBLIC_BASE_URL) {
		return process.env.NEXT_PUBLIC_BASE_URL;
	}

	if (process.env.NODE_ENV === "development") {
		return "http://localhost:3000";
	}

	return "https://www.invistaai.com.br";
}

export function getSiteName() {
	return process.env.NEXT_PUBLIC_NAME || "InvistaAi";
}
