import { League_Spartan } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import "../app/assets/scss/style.scss";
import "../app/assets/css/materialdesignicons.min.css";

import { Providers } from "./providers";

const league = League_Spartan({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	display: "swap",
	variable: "--font-league",
});

export const metadata = {
	title: "InvistaAi",
	description: "InvistaAi - Next Js Real Estate Bootstrap 5 Landing Template",
};

export default function RootLayout({ children }) {
	return (
		<html lang="pt-BR">
			<body className={league.variable}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
