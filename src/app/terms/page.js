import React from "react";
import Link from "next/link";

import { FiArrowRight } from "../assets/icons/vander";

import Accordion from "../components/accordian";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";

export default function Terms() {
	return (
		<>
			<Navbar
				navClass="defaultscroll sticky"
				logolight={true}
				menuClass="navigation-menu nav-left nav-light"
			/>
			<section
				className="bg-half-170 d-table w-100"
				style={{ backgroundImage: "url('/images/bg/03.jpg')" }}
			>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
									Termos e condições
								</h5>
							</div>
						</div>
					</div>
					<div className="position-middle-bottom">
						<nav aria-label="breadcrumb" className="d-block">
							<ul className="breadcrumb breadcrumb-muted mb-0 p-0">
								<li className="breadcrumb-item">
									<Link href="/">Início</Link>
								</li>
								<li className="breadcrumb-item active" aria-current="page">
									Termos e condições
								</li>
							</ul>
						</nav>
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
					<div className="row justify-content-center">
						<div className="col-lg-9">
							<div className="card shadow border-0 rounded-3">
								<div className="card-body">
									<h5 className="card-title">Introdução :</h5>
									<p className="text-muted">
										Estes Termos e Condições regulam o uso deste site e de todos
										os serviços nele oferecidos. Ao acessar nossa plataforma,
										você concorda integralmente com as regras aqui descritas.
										Caso não concorde, recomendamos não utilizar nossos
										serviços.
									</p>

									<h5 className="card-title mb-0">Acordo com o Usuário :</h5>
									<p className="text-muted mb-2">
										O acesso e uso deste site são permitidos apenas para fins
										legítimos. Ao utilizá-lo, o usuário compromete-se a:
									</p>
									<ul className="list-unstyled text-muted mb-2">
										<li className="ms-0 mt-2">
											<FiArrowRight className="fea icon-sm me-2" />
											Fornecer informações verdadeiras e atualizadas.
										</li>
										<li className="ms-0 mt-2">
											<FiArrowRight className="fea icon-sm me-2" />
											Respeitar as leis e regulamentos aplicáveis.
										</li>
										<li className="ms-0 mt-2">
											<FiArrowRight className="fea icon-sm me-2" />
											Não utilizar o site para fins fraudulentos, difamatórios
											ou ilícitos.
										</li>
										<li className="ms-0 mt-2">
											<FiArrowRight className="fea icon-sm me-2" />
											Não copiar, distribuir ou modificar conteúdos sem
											autorização prévia.
										</li>
									</ul>

									<p className="text-muted">
										A propriedade intelectual de todos os textos, imagens,
										logotipos e outros elementos pertence exclusivamente à
										empresa, sendo vedado seu uso indevido. <br />A empresa não
										garante disponibilidade contínua do site e se exime de
										responsabilidades por problemas técnicos, falhas de conexão
										ou danos causados por softwares maliciosos.
									</p>

									<h5 className="card-title">Restrições :</h5>
									<p className="text-muted">
										Você está especificamente proibido de:
									</p>
									<ul className="list-unstyled text-muted">
										<li className="ms-0 mt-2">
											<FiArrowRight className="fea icon-sm me-2" />
											Utilizar o site para qualquer atividade ilegal.
										</li>
										<li className="ms-0 mt-2">
											<FiArrowRight className="fea icon-sm me-2" />
											Reproduzir, duplicar ou vender conteúdo sem permissão.
										</li>
										<li className="ms-0 mt-2">
											<FiArrowRight className="fea icon-sm me-2" />
											Violar direitos autorais ou marcas registradas.
										</li>
										<li className="ms-0 mt-2">
											<FiArrowRight className="fea icon-sm me-2" />
											Manipular informações de outros usuários.
										</li>
									</ul>

									<h5 className="card-title">Perguntas Frequentes :</h5>

									<Accordion />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Footer />
			<ScrollTop />
		</>
	);
}
