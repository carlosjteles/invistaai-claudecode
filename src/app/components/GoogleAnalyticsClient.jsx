"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-4BELWMGKF8";

export default function GoogleAnalyticsClient() {
	const pathname = usePathname();

	useEffect(() => {
		if (!GA_ID) return;

		if (typeof window !== "undefined") {
			window.dataLayer = window.dataLayer || [];
			if (typeof window.gtag === "function") {
				window.gtag("config", GA_ID, { page_path: pathname });
			} else {
				window.dataLayer.push({ event: "page_view", page_path: pathname });
			}
		}
	}, [pathname]);

	return null;
}
