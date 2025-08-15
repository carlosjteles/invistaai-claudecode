import React from "react";
import Link from "next/link";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";

import { contact } from "../storage/data";

import {
	FiPhone,
	FiHexagon,
	FiMapPin,
	FiMail,
	AiOutlineWhatsApp,
} from "../assets/icons/vander";

import { formatPhone } from "../helper/formatter";

export default function ContactUs() {
	return (
		<>
			<Navbar
				navClass="defaultscroll sticky"
				logolight={true}
				menuClass="navigation-menu nav-left nav-light"
			/>
			<section
				className="bg-half-170 d-table w-100"
				style={{ backgroundImage: "url('/images/bg/04.jpg')" }}
			>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<p className="text-white-50 para-desc mx-auto mb-0">
									Ajudamos você a realizar seu sonho
								</p>
								<h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
									Fale agora com nossa equipe
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
									Contato
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
			<section className="section pb-0">
				<div className="container">
					<div className="row justify-content-center">
						<div className="col-lg-8">
							<div className="p-4 rounded-3 shadow">
								<form>
									<div className="row">
										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label">
													Seu nome <span className="text-danger">*</span>
												</label>
												<input
													name="name"
													id="name"
													type="text"
													className="form-control"
													placeholder="Nome :"
												/>
											</div>
										</div>

										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label">
													Seu e-mail <span className="text-danger">*</span>
												</label>
												<input
													name="email"
													id="email"
													type="email"
													className="form-control"
													placeholder="E-mail :"
												/>
											</div>
										</div>

										<div className="col-12">
											<div className="mb-3">
												<label className="form-label">Assunto</label>
												<input
													name="subject"
													id="subject"
													className="form-control"
													placeholder="Assunto :"
												/>
											</div>
										</div>

										<div className="col-12">
											<div className="mb-3">
												<label className="form-label">
													Comentários <span className="text-danger">*</span>
												</label>
												<textarea
													name="comments"
													id="comments"
													rows="4"
													className="form-control"
													placeholder="Mensagem :"
												></textarea>
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-12">
											<div className="d-grid">
												<button
													type="submit"
													id="submit"
													name="send"
													className="btn btn-primary"
												>
													Enviar Mensagem
												</button>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>

				<div className="container mt-100 mt-60">
					<div className="row g-4">
						<div className="col-md-3">
							<div className="position-relative features text-center mx-lg-3 px-md-1">
								<div className="feature-icon position-relative overflow-hidden d-flex justify-content-center">
									<FiHexagon className="hexagon" />
									<div className="position-absolute top-50 start-50 translate-middle">
										<FiPhone className="fea icon-m-md text-primary" />
									</div>
								</div>

								<div className="mt-4">
									<h5 className="mb-3">Telefone</h5>
									<p className="text-muted">
										Comece agora mesmo a buscar o imóvel ideal com a nossa
										equipe
									</p>
									<Link href={`tel:${contact.phone}`} className="text-primary">
										{formatPhone(contact.phone)}
									</Link>
								</div>
							</div>
						</div>

						<div className="col-md-3">
							<div className="position-relative features text-center mx-lg-3 px-md-1">
								<div className="feature-icon position-relative overflow-hidden d-flex justify-content-center">
									<FiHexagon className="hexagon" />
									<div className="position-absolute top-50 start-50 translate-middle">
										<AiOutlineWhatsApp className="fea icon-m-md text-primary" />
									</div>
								</div>

								<div className="mt-4">
									<h5 className="mb-3">Whatsapp</h5>
									<p className="text-muted">
										Atendimento rápido e personalizado para encontrar o imóvel
										ideal.
									</p>
									<Link
										href={`https://wa.me/${contact.phone}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-primary"
									>
										Falar no WhatsApp
									</Link>
								</div>
							</div>
						</div>

						<div className="col-md-3">
							<div className="position-relative features text-center mx-lg-3 px-md-1">
								<div className="feature-icon position-relative overflow-hidden d-flex justify-content-center">
									<FiHexagon className="hexagon" />
									<div className="position-absolute top-50 start-50 translate-middle">
										<FiMail className="fea icon-m-md text-primary" />
									</div>
								</div>

								<div className="mt-4">
									<h5 className="mb-3">Email</h5>
									<p className="text-muted">
										Envie suas dúvidas ou agende uma visita com facilidade
									</p>
									<Link
										href={`mailto:${contact.email}`}
										className="text-primary"
									>
										{contact.email}
									</Link>
								</div>
							</div>
						</div>

						<div className="col-md-3">
							<div className="position-relative features text-center mx-lg-3 px-md-1">
								<div className="feature-icon position-relative overflow-hidden d-flex justify-content-center">
									<FiHexagon className="hexagon" />
									<div className="position-absolute top-50 start-50 translate-middle">
										<FiMapPin className="fea icon-m-md text-primary" />
									</div>
								</div>

								<div className="mt-4">
									<h5 className="mb-3">Localização</h5>
									<p
										className="text-muted"
										dangerouslySetInnerHTML={{ __html: contact.address }}
									></p>
									<Link
										href="https://maps.app.goo.gl/Q8jFNpztn8ndJdj18"
										className="text-primary"
										rel="noopener noreferrer"
										target="_blank"
									>
										Ver no Google Maps
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="container-fluid mt-100 mt-60">
					<div className="row">
						<div className="col-12 p-0">
							<div className="card map border-0">
								<div className="card-body p-0">
									<iframe
										src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8673.001502629168!2d-46.6945696!3d-23.611552799999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce50cbf8cfe177%3A0x2e4796ba4256d66a!2sAv.%20Engenheiro%20Lu%C3%ADs%20Carlos%20Berrini%2C%201681%20-%20Sl.111%2F112%20-%20Cidade%20Mon%C3%A7%C3%B5es%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2004571-011!5e1!3m2!1spt-BR!2sbr!4v1754091802104!5m2!1spt-BR!2sbr"
										style={{ border: "0" }}
										title="InvistaAi Localização"
										allowFullScreen
									></iframe>
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
