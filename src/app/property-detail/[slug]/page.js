"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { categories } from "../../storage/filters";
import Error from "../../error/page";
import PropertyDetailImg from "../../components/propertyDetailImg";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import ScrollTop from "../../components/scrollTop";
import PropertySlider from "../../components/propertySlider";

import { propertyData as data } from "../../storage/data";
import { contact } from "../../storage/about";

import { formatPrice } from "../../helper/formatter";

export default function PropertyDetails(props) {
	const propertyData = data.find((item) => item.slug === props.params.slug);

	if (!propertyData) {
		return <Error />;
	}

	const searchParams = useSearchParams();
	const openGallery = searchParams.get("openGallery");

	const whatsappMessage = (property) => {
		const text = `Olá, quero agendar uma visita para o imóvel ${property} que vi no site.`;
		return `https://wa.me/${contact.phone}?text=${encodeURIComponent(text)}`;
	};

	return (
		<>
			<Navbar
				navClass="defaultscroll sticky"
				menuClass="navigation-menu nav-left"
			/>
			<section className="section mt-5 pt-4">
				<div className="container-fluid mt-2">
					<PropertyDetailImg
						images={propertyData.images}
						openGallery={openGallery}
					/>
				</div>

				<div className="container mt-100 mt-60">
					<div className="row g-4">
						<div className="col-lg-8 col-md-7 col-12">
							<div className="section-title">
								<h4 className="title mb-0">{propertyData.address}</h4>

								<ul className="list-unstyled d-flex gap-3 align-items-center justify-content-between mb-0 py-3">
									<li className="list-inline-item">
										<span className="d-flex align-items-center">
											<i className="mdi mdi-arrow-expand-all fs-4 me-2 text-primary"></i>
											<span className="text-muted fs-5">
												{propertyData.preview.area}
											</span>
										</span>
									</li>

									<li className="list-inline-item">
										<span className="d-flex align-items-center">
											<i className="mdi mdi-bed fs-4 me-2 text-primary"></i>
											<span className="text-muted fs-5">
												{propertyData.preview.bedroom}
											</span>
										</span>
									</li>

									<li className="list-inline-item">
										<span className="d-flex align-items-center">
											<i className="mdi mdi-shower fs-4 me-2 text-primary"></i>
											<span className="text-muted fs-5">
												{propertyData.preview.suite}
											</span>
										</span>
									</li>

									<li className="list-inline-item">
										<span className="d-flex align-items-center">
											<i className="mdi mdi-car fs-4 me-2 text-primary"></i>
											<span className="text-muted fs-5">
												{propertyData.preview.parking}
											</span>
										</span>
									</li>
								</ul>

								{propertyData.description &&
									propertyData.description.map((desc, index) => (
										<p key={index} className="text-muted">
											{desc}
										</p>
									))}

								{propertyData.description_embed && (
									<div className="card map border-0">
										<div className="card-body p-0">
											<iframe
												src={propertyData.description_embed}
												className="rounded-3"
												style={{ border: "0" }}
												title={propertyData.address}
												allowFullScreen
											></iframe>
										</div>
									</div>
								)}
							</div>
						</div>

						<div className="col-lg-4 col-md-5 col-12">
							<div className="rounded-3 shadow bg-white sticky-bar p-4">
								<h5 className="mb-3">A partir de:</h5>

								<div className="d-flex align-items-center justify-content-between">
									<h5 className="mb-0">{formatPrice(propertyData.price)}</h5>
									<span className="badge bg-primary">
										{
											categories.find(
												(item) => item.id === propertyData.category
											)?.label
										}
									</span>
								</div>

								<div>
									<div className="d-flex align-items-center justify-content-between mt-2">
										<span className="small text-muted">Preço por m²</span>
										<span className="small">
											{formatPrice(propertyData.price / propertyData.min_area)}
										</span>
									</div>

									<div className="d-flex align-items-center justify-content-between mt-2">
										<span className="small text-muted">Entrega</span>
										<span className="small">{propertyData.delivery_in}</span>
									</div>
								</div>

								<div className="d-flex mt-3">
									<Link href="#" className="btn btn-primary w-100 small me-2">
										Download Book
									</Link>
									<Link
										href={whatsappMessage(propertyData.id)}
										className="btn btn-primary w-100 small"
									>
										Agendar Agora
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="container mt-100 mt-60">
					<div className="row justify-content-center">
						<div className="col">
							<div className="section-title text-center mb-4 pb-2">
								<h4 className="title mb-3">Você também pode gostar</h4>
								<p className="text-muted para-desc mb-0 mx-auto">
									Confira opções semelhantes à venda e encontre seu próximo
									imóvel.
								</p>
							</div>
						</div>
					</div>

					<PropertySlider />
				</div>
			</section>
			<Footer />
			<ScrollTop />
		</>
	);
}
