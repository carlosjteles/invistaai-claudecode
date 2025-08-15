import React from "react";

import FaqTab from "../components/faqTab";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";

export default function Faqs() {
	return (
		<>
			<Navbar
				navClass="defaultscroll sticky"
				logolight={true}
				menuClass="navigation-menu nav-left nav-light"
			/>
			<section
				className="bg-half-170 d-table w-100"
				style={{ backgroundImage: "url('/images/bg/faqs.webp')" }}
			>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<p className="text-white-50 para-desc mx-auto mb-0">
									Central de Ajuda
								</p>
								<h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
									Perguntas Frequentes
								</h5>
							</div>
						</div>
					</div>
				</div>
			</section>
			<div className="position-relative">
				<div className="shape overflow-hidden text-white">
					<svg
						viewBox="0 0 2880 48"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
							fill="currentColor"
						></path>
					</svg>
				</div>
			</div>
			<section className="section">
				<div className="container">
					<FaqTab />
				</div>
			</section>
			<Footer />
			<ScrollTop />
		</>
	);
}
