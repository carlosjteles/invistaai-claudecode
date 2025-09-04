export const SEND_EMAIL_POST = (data) => {
	return {
		url: "/api/send-email",
		options: {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		},
	};
};
