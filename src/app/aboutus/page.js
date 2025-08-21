import React from "react";
import Image from "next/image";
import Link from "next/link";

import Navbar from "../components/navbar";
import About from "../components/about";
import Blog from "../components/blog";
import GetInTouch from "../components/getInTouch";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";
import AboutCounter from "../components/counter/aboutCounter";
import Broker from "../components/broker";

import { FiArrowRight } from "react-icons/fi";

import { contact } from "../storage/about";

export default function AboutUs() {
	return (
		<>
			<Navbar
				navClass="defaultscroll sticky"
				logolight={true}
				menuClass="navigation-menu nav-left nav-light"
			/>
			<section
				className="bg-half-170 d-table w-100"
				style={{ backgroundImage: "url('/images/bg/aboutus.webp')" }}
			>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<p className="text-white-50 para-desc mx-auto mb-0">
									Nossa história: InvistaAi
								</p>
								<h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
									Sobre nós
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
					<div className="row align-items-center">
						<div className="col-lg-6 col-md-6">
							<div className="about-left">
								<div className="position-relative shadow p-2 rounded-top-pill rounded-5 bg-white img-one">
									<Image
										src="/images/about-01.webp"
										width={0}
										height={0}
										sizes="100vw"
										style={{ width: "100%", height: "auto" }}
										className="img-fluid rounded-top-pill rounded-5"
										alt="Prédio InvistaAi"
									/>
									<div className="position-absolute top-0 start-0 z-n1">
										<Image
											src="/images/svg/dots.svg"
											width={0}
											height={0}
											sizes="100vw"
											style={{ width: "100%", height: "auto" }}
											className="avatar avatar-xl-large"
											alt="Padrão de fundo com bolinhas"
										/>
									</div>
								</div>

								<div className="img-two shadow rounded-3 overflow-hidden p-2 mb-2 bg-white">
									<Image
										src="/images/plate.webp"
										width={0}
										height={0}
										sizes="100vw"
										style={{ width: "100%", height: "auto" }}
										className="img-fluid rounded-3"
										alt="Placa Prédio"
									/>
								</div>

								<span className="badge bg-info mt-4">
									Eficiência. Transparência. Controle. Invista com inteligência.
								</span>
							</div>
						</div>

						<div className="col-lg-6 col-md-6 mt-4 mt-sm-0 pt-2 pt-sm-0">
							<div className="section-title ms-lg-5">
								<h6 className="text-primary fw-medium mb-2">InvistaAi</h6>
								<h4 className="title mb-3">
									É investimento imobiliário reimaginado
								</h4>
								<p className="text-muted para-desc mb-3">
									Conectamos pessoas e capital a{" "}
									<strong>oportunidades imobiliárias</strong> em São Paulo — do{" "}
									<strong>primeiro imóvel / casa própria</strong> a ativos de{" "}
									<strong>alto padrão</strong> com excelente potencial de
									valorização. Unimos dados de mercado, tecnologia e uma rede de
									parceiros para entregar <strong>curadoria rigorosa</strong>,
									comparativos claros e acompanhamento consultivo do início ao
									fim.
								</p>
								<ul className="list-unstyled text-muted mb-2">
									<li className="ms-0 mt-2">
										<FiArrowRight className="fea icon-sm me-2 ms-0" />
										Curadoria de empreendimentos com potencial de valorização
									</li>
									<li className="ms-0 mt-2">
										<FiArrowRight className="fea icon-sm me-2 ms-0" />
										Atendimento consultivo para investidor e comprador do
										primeiro imóvel
									</li>
									<li className="ms-0 mt-2">
										<FiArrowRight className="fea icon-sm me-2 ms-0" />
										Suporte completo: estudo financeiro, crédito e documentação
									</li>
								</ul>

								<div className="mt-4">
									<Link
										href={`https://wa.me/${contact.phone}`}
										target="_blank"
										rel="noopener noreferrer"
										className="btn btn-pills btn-primary"
									>
										Fale com um consultor{" "}
										<i className="mdi mdi-arrow-right align-middle"></i>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="container mt-100 mt-60">
					<About />
				</div>

				<div className="container-fluid bg-building-pic mt-100 mt-60">
					<div
						className=" opacity-25 position-absolute w-100 h-100 top-0 start-0"
						style={{
							backgroundImage: "url('/images/map.png')",
							backgroundPosition: "center",
						}}
					></div>
					<div className="container">
						<div className="row justify-content-center">
							<div className="col">
								<div className="section-title text-center mb-4 pb-2">
									<h4 className="title mb-3">
										Confiança construída com resultados reais
									</h4>
									<p className="text-muted para-desc mb-0 mx-auto">
										Acompanhamos investidores e compradores do primeiro imóvel
										com transparência em cada etapa.
									</p>
								</div>
							</div>
						</div>

						<AboutCounter />
					</div>
				</div>

				<div className="container mt-100 mt-60">
					<Broker />
				</div>

				<div className="container mt-100 mt-60">
					<Blog />
				</div>

				<div className="container mt-100 mt-60">
					<GetInTouch />
				</div>
			</section>
			<Footer />
			<ScrollTop />
		</>
	);
}
