export const formatPrice = (price) => {
	if (typeof price !== "number") {
		return "";
	}
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(price);
};

export const formatDate = (dateString) => {
	const options = { year: "numeric", month: "long", day: "numeric" };
	const date = new Date(dateString);
	return date.toLocaleDateString("pt-BR", options);
};

export const formatBathrooms = (bathrooms) => {
	if (typeof bathrooms !== "number" || bathrooms < 0) {
		return "";
	}
	return `${bathrooms} ${bathrooms === 1 ? "banheiro" : "banheiros"}`;
};

export const formatBedrooms = (bedrooms) => {
	if (typeof bedrooms !== "number" || bedrooms < 0) {
		return "";
	}
	return `${bedrooms} ${bedrooms === 1 ? "quarto" : "quartos"}`;
};

export const formatArea = (area) => {
	if (typeof area !== "number" || area < 0) {
		return "";
	}
	return `${area} m²`;
};

export const formatPhone = (phone) => {
	let digits = phone.replace(/\D/g, "");

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

export function timeInSystem(dateStr) {
	if (!dateStr || typeof dateStr !== "string") {
		return 0;
	}

	let createdDate;

	if (dateStr.includes("/")) {
		// Format: dd/mm/yyyy
		const [day, month, year] = dateStr.split("/");

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
		if (isNaN(Date.parse(dateStr))) {
			return 0;
		}
		createdDate = new Date(`${dateStr}T00:00:00`);
	}

	const today = new Date();
	createdDate.setHours(0, 0, 0, 0);
	today.setHours(0, 0, 0, 0);
	const diffMs = today - createdDate;
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	return diffDays;
}
