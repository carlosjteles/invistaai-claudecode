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
										<Link href="/" className="logo-footer" aria-label={`${getSiteName()} – página inicial`}>
											<Image src="/images/logo-light.svg" width={124} height={24} alt={getSiteName()} />
										</Link>
										<p className="mt-4">
											Apartamentos de alto padrão em São Paulo: lançamentos, obras e
											imóveis prontos selecionados, com acompanhamento de corretor do
											primeiro contato à entrega das chaves.
										</p>
										<p className="small mb-0">
											{contact.broker.name} · Corretor de imóveis · CRECI-SP {contact.broker.creci}
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
										<h5 className="footer-head">Imóveis</h5>
										<ul className="list-unstyled footer-list mt-4">
											<li>
												<Link href="/imoveis" className="text-foot">
													<i className="mdi mdi-chevron-right align-middle me-1"></i> Todos os imóveis
												</Link>
											</li>
											<li>
												<Link href="/lancamentos" className="text-foot">
													<i className="mdi mdi-chevron-right align-middle me-1"></i> Lançamentos
												</Link>
											</li>
											<li>
												<Link href="/indice-preco-m2" className="text-foot">
													<i className="mdi mdi-chevron-right align-middle me-1"></i> Preço do m² por bairro
												</Link>
											</li>
											<li>
												<Link href="/comparar" className="text-foot">
													<i className="mdi mdi-chevron-right align-middle me-1"></i> Comparar imóveis
												</Link>
											</li>
										</ul>
									</div>

									<div className="col-lg-3 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
										<h5 className="footer-head">Guias de bairro</h5>
										<ul className="list-unstyled footer-list mt-4">
											<li>
												<Link href="/blog/bairro-moema" className="text-foot">
													<i className="mdi mdi-chevron-right align-middle me-1"></i> Moema
												</Link>
											</li>
											<li>
												<Link href="/blog/itaim-bibi" className="text-foot">
													<i className="mdi mdi-chevron-right align-middle me-1"></i> Itaim Bibi
												</Link>
											</li>
											<li>
												<Link href="/blog/bairro-jardim-europa" className="text-foot">
													<i className="mdi mdi-chevron-right align-middle me-1"></i> Jardim Europa
												</Link>
											</li>
											<li>
												<Link href="/blog/bairro-brooklin" className="text-foot">
													<i className="mdi mdi-chevron-right align-middle me-1"></i> Brooklin
												</Link>
											</li>
											<li>
												<Link href="/blog/bairro-perdizes" className="text-foot">
													<i className="mdi mdi-chevron-right align-middle me-1"></i> Perdizes
												</Link>
											</li>
										</ul>
									</div>

									<div className="col-lg-3 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
										<h5 className="footer-head">Contato</h5>

										<div className="d-flex mt-4">
											<AiOutlineWhatsApp className="fea icon-sm text-primary mt-1 me-3" />
											<Link href={`https://wa.me/${contact.phone}`} className="text-foot" target="_blank" rel="noopener noreferrer">
												{formatPhone(contact.phone)} (WhatsApp)
											</Link>
										</div>

										<div className="d-flex mt-3">
											<FiMail className="fea icon-sm text-primary mt-1 me-3" />
											<Link href={`mailto:${contact.email}`} className="text-foot">
												{contact.email}
											</Link>
										</div>

										<div className="d-flex mt-3">
											<FiMapPin className="fea icon-sm text-primary mt-1 me-3" />
											<div>
												<p className="mb-2">
													{contact.address.street}
													{contact.address.complement ? `, ${contact.address.complement}` : ""}
													<br />
													{contact.address.neighborhood}, {contact.address.city}/{contact.address.state}
													<br />
													CEP {contact.address.zip}
												</p>
												<Link href={contact.map} className="text-primary" rel="noopener noreferrer" target="_blank">
													Ver no Google Maps
												</Link>
											</div>
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
									<ul className="list-inline mb-2">
										{[
											["/sobre", "Sobre"],
											["/blogs", "Notícias"],
											["/perguntas-frequentes", "Perguntas frequentes"],
											["/contato", "Contato"],
											["/termos-e-condicoes", "Termos e condições"],
											["/politica-de-privacidade", "Política de privacidade"],
										].map(([href, label]) => (
											<li className="list-inline-item mx-2" key={href}>
												<Link href={href} className="text-foot small">
													{label}
												</Link>
											</li>
										))}
									</ul>
									<p className="mb-1">
										© {new Date().getFullYear()}{" "}
										<Link href="#" className="text-reset" onClick={scrollToTop}>
											{getSiteName()}
										</Link>
										. Todos os direitos reservados. {contact.broker.name} · CRECI-SP{" "}
										{contact.broker.creci}
									</p>
									<p className="small mb-0 opacity-75">
										Imagens meramente ilustrativas. Preços, plantas e prazos
										informados pelas incorporadoras e sujeitos a alteração sem
										aviso prévio.
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
