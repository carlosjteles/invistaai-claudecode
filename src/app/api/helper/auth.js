export const API_TOKEN = process.env.API_TOKEN;

export function verifyToken(request) {
	const token = request.headers.get("x-api-key");
	if (!token) {
		return {
			success: false,
			message: "Token de API não fornecido",
			status: 401,
		};
	}
	if (token !== API_TOKEN) {
		return {
			success: false,
			message: "Token de API inválido",
			status: 403,
		};
	}
	return { success: true };
}
