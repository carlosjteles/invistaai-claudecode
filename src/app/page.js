import React from "react";
import Link from "next/link";
import Image from "next/image";

import Categories from "./components/categories";
import Customers from "./components/customers";
import FeaturedProperties from "./components/featuredProperties";
import Footer from "./components/footer";
import GetInTouch from "./components/getInTouch";
import HomeFilter from "./components/homeFilter";
import Navbar from "./components/navbar";
import ScrollTop from "./components/scrollTop";
import TextAnimation from "./components/textAnimation";

export default function Home() {
	return (
		<>
			<Navbar
				navClass="defaultscroll sticky"
				menuClass="navigation-menu nav-left"
			/>
			<section className="position-relative mt-5 pt-4">
				<div className="container-fluid px-md-4 px-2 mt-2">
					<div
						className="bg-home-one d-table w-100 shadow rounded-3 overflow-hidden"
						id="home"
					>
						<div
							className="bg-overlay image-wrap "
							id="hero-images"
							style={{ backgroundImage: "url('/images/bg/03.jpg')" }}
						></div>
						<div className="bg-overlay bg-black opacity-50"></div>

						<div className="container">
							<div className="row justify-content-center">
								<div className="col-12">
									<div className="title-heading">
										<TextAnimation />
										<p className="para-desc text-white title-dark mb-0">
											Uma plataforma inteligente para quem quer comprar imóveis
											com agilidade, confiança e sem taxas abusivas.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="section pt-5">
				<div className="container">
					<HomeFilter />
				</div>

				<div className="container mt-100 mt-60">
					<div className="row align-items-center">
						<div className="col-lg-6 col-md-6">
							<div className="row g-3 align-items-center">
								<div className="col-lg-7 col-6">
									<Image
										src="/images/home-about-01.webp"
										width={0}
										height={0}
										sizes="100vw"
										style={{ width: "100%", height: "auto" }}
										className="img-fluid rounded-3"
										alt="invistaai"
										title="InvistaAi"
									/>
								</div>

								<div className="col-lg-5 col-6">
									<div className="row g-3">
										<div className="col-lg-12 col-md-12">
											<Image
												src="/images/home-about-02.webp"
												width={0}
												height={0}
												sizes="100vw"
												style={{ width: "100%", height: "auto" }}
												className="img-fluid rounded-3"
												alt="invistaai"
												title="InvistaAi"
											/>
										</div>

										<div className="col-lg-12 col-md-12">
											<Image
												src="/images/logo-icon.png"
												width={100}
												height={100}
												className="img-fluid"
												alt="invistaai"
												title="InvistaAi"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="col-lg-6 col-md-6 mt-4 mt-sm-0 pt-2 pt-sm-0">
							<div className="section-title ms-lg-5">
								<h6 className="text-primary fw-medium mb-2">
									Por que escolher a InvistaAi
								</h6>
								<h4 className="title mb-3">
									Investimento imobiliário com foco em valorização
								</h4>
								<p className="text-muted para-desc mb-0">
									Nossa plataforma une dados de mercado, tecnologia e curadoria
									criteriosa para entregar comparativos claros e análises
									fundamentadas. Isso garante decisões de investimento seguras e
									alinhadas ao seu perfil, seja para diversificação de carteira
									ou conquista da casa própria.
								</p>

								<p className="text-muted para-desc mb-0">
									Mais do que uma plataforma, oferecemos acompanhamento
									consultivo em todas as etapas: do estudo financeiro ao crédito
									e documentação. Transparência e resultados reais são a base da
									confiança que construímos com cada investidor.
								</p>

								<div className="mt-4">
									<Link href="/sobre" className="btn btn-pills btn-primary">
										Saiba Mais{" "}
										<i className="mdi mdi-arrow-right align-middle"></i>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="container mt-100 mt-60">
					<Categories />
				</div>

				<div className="container mt-100 mt-60">
					<FeaturedProperties />
				</div>

				<div className="container mt-100 mt-60">
					<Customers />
				</div>

				<div className="container mt-100 mt-60">
					<GetInTouch />
				</div>
			</section>
			<Footer showImage={true} />
			<ScrollTop />
		</>
	);
}
