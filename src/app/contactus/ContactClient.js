"use client";
import React from "react";
import Link from "next/link";
import Script from "next/script";
import dynamic from "next/dynamic";

import { useDispatch, useSelector } from "react-redux";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
	ssr: false,
});

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollTop from "../components/ScrollTop";

import { contact } from "../storage/about";

import { sendEmail } from "../store/contact";

import {
	FiPhone,
	FiHexagon,
	FiMapPin,
	FiMail,
	AiOutlineWhatsApp,
} from "../assets/icons/vander";

import { formatPhone } from "../helper/formatter";
import { getBaseUrl, getSiteName } from "../helper/utils";

import Swal from "sweetalert2";

export default function ContactClient() {
	console.log("key:  ", process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY);
	const [name, setName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [subject, setSubject] = React.useState("");
	const [message, setMessage] = React.useState("");

	const [alertShow, setAlertShow] = React.useState(null);

	const recaptchaRef = React.useRef(null);

	const { data, error, loading } = useSelector((state) => state.contact);

	const dispatch = useDispatch();

	React.useEffect(() => {
		const formReset = () => {
			setName("");
			setEmail("");
			setSubject("");
			setMessage("");
		};

		if ((data && data.message) || error) {
			Swal.fire({
				icon: error ? "error" : "success",
				title: error ? error : data.message,
				showConfirmButton: false,
				timer: 3500,
			});
			setAlertShow(true);
		}

		if (data && data.message) {
			formReset();
		}
	}, [data, error, alertShow]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const recaptchaToken = await recaptchaRef.current.executeAsync();
		recaptchaRef.current.reset();

		setAlertShow(false);

		const formData = {
			name,
			email,
			subject,
			message,
		};

		dispatch(sendEmail(formData, recaptchaToken));
	};

	const contactJsonLd = {
		"@context": "https://schema.org",
		"@type": "ContactPage",
		name: "Entre em Contato",
		description:
			"Fale com nossa equipe especializada para encontrar seu imóvel ideal em São Paulo.",
		url: `${getBaseUrl()}/contato`,
		mainEntity: {
			"@type": "Organization",
			name: getSiteName(),
			logo: `${getBaseUrl()}/logo.png`,
			email: contact.email,
			telephone: `+${contact.phone}`,
			sameAs: Object.values(contact.social),
			address: {
				"@type": "PostalAddress",
				streetAddress: contact.address.street,
				addressLocality: contact.address.city,
				addressRegion: contact.address.state,
				postalCode: contact.address.zip,
				addressCountry: "BR",
			},
			contactPoint: [
				{
					"@type": "ContactPoint",
					telephone: `+${contact.phone}`,
					contactType: "customer service",
					availableLanguage: "Portuguese",
				},
				{
					"@type": "ContactPoint",
					email: contact.email,
					contactType: "customer support",
				},
			],
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Início",
					item: getBaseUrl(),
				},
				{
					"@type": "ListItem",
					position: 2,
					name: "Contato",
					item: `${getBaseUrl()}/contato`,
				},
			],
		},
	};

	return (
		<>
			<Script
				id="contact-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
			/>

			<Navbar
				navClass="defaultscroll sticky"
				logolight={true}
				menuClass="navigation-menu nav-left nav-light"
			/>

			<section
				className="bg-half-170 d-table w-100"
				style={{
					backgroundImage: "url('/images/bg/contactus.webp')",
				}}
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
							<ul
								className="breadcrumb breadcrumb-muted mb-0 p-0"
								itemScope
								itemType="https://schema.org/BreadcrumbList"
							>
								<li
									className="breadcrumb-item"
									itemProp="itemListElement"
									itemScope
									itemType="https://schema.org/ListItem"
								>
									<Link href="/" itemProp="item">
										<span itemProp="name">Início</span>
									</Link>

									<meta itemProp="position" content="1" />
								</li>
								<li
									className="breadcrumb-item active"
									aria-current="page"
									itemProp="itemListElement"
									itemScope
									itemType="https://schema.org/ListItem"
								>
									<span itemProp="name">Contato</span>
									<meta itemProp="position" content="2" />
									<meta itemProp="item" content={`${getBaseUrl()}/contato`} />
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
							<div
								className="p-4 rounded-3 shadow"
								itemScope
								itemType="https://schema.org/WebSite"
							>
								<meta itemProp="url" content={`${getBaseUrl()}/`} />

								<div
									itemProp="potentialAction"
									itemScope
									itemType="https://schema.org/ContactAction"
								>
									<form onSubmit={handleSubmit}>
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
														value={name}
														onChange={(e) => setName(e.target.value)}
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
														value={email}
														onChange={(e) => setEmail(e.target.value)}
														className="form-control"
														placeholder="E-mail :"
													/>
												</div>
											</div>

											<div className="col-12">
												<div className="mb-3">
													<label className="form-label">
														Assunto <span className="text-danger">*</span>
													</label>
													<input
														name="subject"
														id="subject"
														value={subject}
														onChange={(e) => setSubject(e.target.value)}
														className="form-control"
														placeholder="Assunto :"
													/>
												</div>
											</div>

											<div className="col-12">
												<div className="mb-3">
													<label className="form-label">
														Mensagem <span className="text-danger">*</span>
													</label>
													<textarea
														name="message"
														id="message"
														rows="4"
														value={message}
														onChange={(e) => setMessage(e.target.value)}
														className="form-control"
														placeholder="Mensagem :"
													></textarea>
												</div>
											</div>

											<ReCAPTCHA
												ref={recaptchaRef}
												size="invisible"
												sitekey={
													process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY
												}
											/>
										</div>
										<div className="row">
											<div className="col-12">
												<div className="d-grid">
													<button
														type="submit"
														id="submit"
														name="send"
														className="btn btn-primary"
														disabled={loading}
													>
														{loading ? "Enviando..." : "Enviar Mensagem"}
													</button>
												</div>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div
					className="container mt-100 mt-60"
					itemScope
					itemType="https://schema.org/Organization"
				>
					<meta itemProp="name" content={getSiteName()} />
					<meta itemProp="url" content={getBaseUrl()} />

					<div className="row g-4">
						<div className="col-md-3">
							<div
								className="position-relative features text-center mx-lg-3 px-md-1"
								itemProp="contactPoint"
								itemScope
								itemType="https://schema.org/ContactPoint"
							>
								<meta itemProp="contactType" content="customer service" />

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
									<Link
										href={`tel:${contact.phone}`}
										className="text-primary"
										itemProp="telephone"
									>
										{formatPhone(contact.phone)}
									</Link>
								</div>
							</div>
						</div>

						<div className="col-md-3">
							<div
								className="position-relative features text-center mx-lg-3 px-md-1"
								itemProp="contactPoint"
								itemScope
								itemType="https://schema.org/ContactPoint"
							>
								<meta itemProp="contactType" content="customer service" />

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
										itemProp="telephone"
									>
										Falar no WhatsApp
									</Link>
								</div>
							</div>
						</div>

						<div className="col-md-3">
							<div
								className="position-relative features text-center mx-lg-3 px-md-1"
								itemProp="contactPoint"
								itemScope
								itemType="https://schema.org/ContactPoint"
							>
								<meta itemProp="contactType" content="customer support" />

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
										itemProp="email"
									>
										{contact.email}
									</Link>
								</div>
							</div>
						</div>

						<div className="col-md-3">
							<div
								className="position-relative features text-center mx-lg-3 px-md-1"
								itemScope
								itemType="https://schema.org/Place"
							>
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
										itemProp="address"
										itemScope
										itemType="https://schema.org/PostalAddress"
									>
										<span itemProp="streetAddress">
											{contact.address.street} {contact.address.complement}
										</span>
										<br />
										<span itemProp="addressLocality">
											{contact.address.neighborhood}
										</span>
										<br />
										<span itemProp="addressRegion">
											{contact.address.city}/{contact.address.state}
										</span>{" "}
										- <span itemProp="postalCode">{contact.address.zip}</span>
									</p>
									<Link
										href={contact.map}
										className="text-primary"
										rel="noopener noreferrer"
										target="_blank"
										itemProp="hasMap"
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
							<div
								className="card map border-0"
								itemScope
								itemType="https://schema.org/Map"
							>
								<div className="card-body p-0">
									<iframe
										src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8673.001502629168!2d-46.6945696!3d-23.611552799999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce50cbf8cfe177%3A0x2e4796ba4256d66a!2sAv.%20Engenheiro%20Lu%C3%ADs%20Carlos%20Berrini%2C%201681%20-%20Sl.111%2F112%20-%20Cidade%20Mon%C3%A7%C3%B5es%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2004571-011!5e1!3m2!1spt-BR!2sbr!4v1754091802104!5m2!1spt-BR!2sbr"
										style={{ border: "0" }}
										title={`Localização ${getSiteName()}`}
										allowFullScreen
										itemProp="hasMap"
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
