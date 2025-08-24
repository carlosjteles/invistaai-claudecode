export const formatPrice = (value) => {
	if (typeof value !== "number") {
		return "";
	}

	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
};

export const formatDate = (value) => {
	const options = { year: "numeric", month: "long", day: "numeric" };
	const date = new Date(value);

	return date.toLocaleDateString("pt-BR", options);
};

export const formatDateUS = (value) => {
	const [day, month, year] = value.split("/").map(Number);
	return new Date(year, month - 1, day);
};

export const formatDateISO = (value) => {
	return formatDateUS(value).toISOString();
};

export const formatBathrooms = (value) => {
	if (typeof value !== "number" || value < 0) {
		return "";
	}
	return `${value} ${value === 1 ? "banheiro" : "banheiros"}`;
};

export const formatBedrooms = (value) => {
	if (typeof value !== "number" || value < 0) {
		return "";
	}
	return `${value} ${value === 1 ? "quarto" : "quartos"}`;
};

export const formatArea = (value) => {
	if (!value || typeof value !== "number" || value < 0) {
		return "";
	}
	return `${value} m²`;
};

export const formatPhone = (value) => {
	let digits = value.replace(/\D/g, "");

	if (digits.length < 10) {
		return "";
	}

	if (digits.startsWith("55")) {
		digits = digits.slice(2);
	}

	let regex = /(\d{2})(\d{5})(\d{4})/;

	if (digits.length === 10) {
		regex = /(\d{2})(\d{4})(\d{4})/;
	}

	return digits.replace(regex, "($1) $2-$3");
};

export function timeInSystem(value) {
	if (!value || typeof value !== "string") {
		return 0;
	}

	let createdDate;

	if (value.includes("/")) {
		// Format: dd/mm/yyyy
		const [day, month, year] = value.split("/");

		if (
			!day ||
			!month ||
			!year ||
			isNaN(Date.parse(`${year}-${month}-${day}`))
		) {
			return 0;
		}
		createdDate = new Date(`${year}-${month}-${day}T00:00:00`);
	} else {
		// Format: yyyy-mm-dd
		if (isNaN(Date.parse(value))) {
			return 0;
		}
		createdDate = new Date(`${value}T00:00:00`);
	}

	const today = new Date();
	createdDate.setHours(0, 0, 0, 0);
	today.setHours(0, 0, 0, 0);
	const diffMs = today - createdDate;
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	return diffDays;
}
