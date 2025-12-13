"use client";
import Link from "next/link";
import Image from "next/image";

import {
	FiLinkedin,
	FiFacebook,
	FiInstagram,
	FiTwitter,
	FiMail,
	FiMapPin,
	FiPhone,
	AiOutlineWhatsApp,
} from "../assets/icons/vander";

import { contact } from "../storage/about";

import { formatPhone } from "../helper/formatter";
import { getSiteName } from "../helper/utils";

export default function Footer({ showImage = false }) {
	const hasSocial = contact.social && Object.keys(contact.social).length > 0;

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<>
			{showImage && (
				<section
					className="bg-building-pic d-table w-100"
					style={{ backgroundImage: "url('/images/building.png')" }}
				></section>
			)}
			<footer className="bg-footer">
				<div className="container">
					<div className="row">
						<div className="col-12">
							<div className="footer-py-60 footer-border">
								<div className="row">
									<div className="col-lg-4 col-12 mb-0 mb-md-4 pb-0 pb-md-2">
										<Link href="#" className="logo-footer">
											<Image
												src="/images/logo-light.svg"
												width={124}
												height={24}
												alt="Logo"
											/>
										</Link>
										<p className="mt-4">
											Encontre o imóvel ideal para comprar com facilidade,
											agilidade e atendimento personalizado.
										</p>
										{hasSocial && (
											<ul className="list-unstyled social-icon foot-social-icon mb-0 mt-4">
												{contact.social.linkedin && (
													<li className="list-inline-item">
														<Link
															href={contact.social.linkedin}
															target="_blank"
															className="rounded-3"
														>
															<FiLinkedin className="fea icon-sm align-middle" />
														</Link>
													</li>
												)}

												{contact.social.facebook && (
													<li className="list-inline-item">
														<Link
															href={contact.social.facebook}
															target="_blank"
															className="rounded-3"
														>
															<FiFacebook className="fea icon-sm align-middle" />
														</Link>
													</li>
												)}

												{contact.social.instagram && (
													<li className="list-inline-item">
														<Link
															href={contact.social.instagram}
															target="_blank"
															className="rounded-3"
														>
															<FiInstagram className="fea icon-sm align-middle" />
														</Link>
													</li>
												)}

												{contact.social.twitter && (
													<li className="list-inline-item">
														<Link
															href={contact.social.twitter}
															target="_blank"
															className="rounded-3"
														>
															<FiTwitter className="fea icon-sm align-middle" />
														</Link>
													</li>
												)}
											</ul>
										)}
									</div>

									<div className="col-lg-2 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
										<h5 className="footer-head">Empresa</h5>
										<ul className="list-unstyled footer-list mt-4">
											<li>
												<Link href="/imoveis" className="text-foot">
													<i className="mdi mdi-chevron-right align-middle me-1"></i>{" "}
													Imóveis
												</Link>
											</li>
											<li>
												<Link href="/sobre" className="text-foot">
													<i className="mdi mdi-chevron-right align-middle me-1"></i>{" "}
													Sobre
												</Link>
											</li>
											<li>
												<Link href="/blogs" className="text-foot">
													<i className="mdi mdi-chevron-right align-middle me-1"></i>{" "}
													Notícias
												</Link>
											</li>
										</ul>
									</div>

									<div className="col-lg-3 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
										<h5 className="footer-head">Links Úteis</h5>
										<ul className="list-unstyled footer-list mt-4">
											<li>
												<Link href="/termos-e-condicoes" className="text-foot">
													<i className="mdi mdi-chevron-right align-middle me-1"></i>{" "}
													Termos e condições
												</Link>
											</li>
											<li>
												<Link
													href="/politica-de-privacidade"
													className="text-foot"
												>
													<i className="mdi mdi-chevron-right align-middle me-1"></i>{" "}
													Política de Privacidade
												</Link>
											</li>
											<li>
												<Link
													href="/perguntas-frequentes"
													className="text-foot"
												>
													<i className="mdi mdi-chevron-right align-middle me-1"></i>{" "}
													Perguntas Frequentes
												</Link>
											</li>
											<li>
												<Link href="/contato" className="text-foot">
													<i className="mdi mdi-chevron-right align-middle me-1"></i>{" "}
													Contato
												</Link>
											</li>
										</ul>
									</div>

									<div className="col-lg-3 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
										<h5 className="footer-head">Contato</h5>

										<div className="d-flex mt-4">
											<FiMapPin className="fea icon-sm text-primary mt-1 me-3" />
											<div>
												<p className="mb-2">
													{contact.address.street}
													<br />
													{contact.address.complement} -{" "}
													{contact.address.neighborhood}
													<br />
													{contact.address.city}/{contact.address.state} -{" "}
													{contact.address.zip}
												</p>
												<Link
													href={contact.map}
													className="text-primary"
													rel="noopener noreferrer"
													target="_blank"
												>
													Ver no Google Maps
												</Link>
											</div>
										</div>

										<div className="d-flex mt-3">
											<FiMail className="fea icon-sm text-primary mt-1 me-3" />
											<Link
												href={`mailto:${contact.email}`}
												className="text-foot"
											>
												{contact.email}
											</Link>
										</div>

										<div className="d-flex mt-3">
											<FiPhone className="fea icon-sm text-primary mt-1 me-3" />
											<Link href={`tel:${contact.phone}`} className="text-foot">
												{formatPhone(contact.phone)}
											</Link>
										</div>

										<div className="d-flex mt-3">
											<AiOutlineWhatsApp className="fea icon-sm text-primary mt-1 me-3" />
											<Link
												href={`https://wa.me/${contact.phone}`}
												className="text-foot"
												target="_blank"
												rel="noopener noreferrer"
											>
												{formatPhone(contact.phone)}
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="footer-py-30 footer-bar">
					<div className="container text-center">
						<div className="row">
							<div className="col">
								<div className="text-center">
									<p className="mb-0 d-flex flex-wrap justify-content-center align-items-end gap-2">
										Todos os direitos reservados.{" "}
										<Link href="#" className="text-reset" onClick={scrollToTop}>
											{getSiteName()}
										</Link>
										<Link
											href="https://www.damcdeveloper.com/"
											target="_blank"
											className="text-reset d-none"
											aria-label="Desenvolvido por DAMC"
										>
											<Image
												src="/images/damc.png"
												alt="DAMC Developer"
												className="img-fluid"
												height={30}
												width={101}
											/>
										</Link>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}
