"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const Lightbox = dynamic(() => import("react-18-image-lightbox"), {
	ssr: false,
});

import "../../../node_modules/react-18-image-lightbox/style.css";

export default function PropertyDetailImg({
	images,
	title,
	openGallery = false,
}) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [open, setIsOpen] = useState(openGallery);

	const currentImage = images[currentImageIndex];
	const firstImage = images.find((img, idx) => idx === 0);

	const handleMovePrev = () => {
		setCurrentImageIndex(
			(prevIndex) => (prevIndex + images.length - 1) % images.length
		);
	};

	const handleMoveNext = () => {
		setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
	};

	const handleImageClick = (index) => {
		setCurrentImageIndex(index);
		setIsOpen(true);
	};

	return (
		<div
			className="row g-2 property-detail"
			itemScope
			itemType="https://schema.org/ImageGallery"
		>
			<meta itemProp="about" content={title || "Detalhes do imóvel"} />
			<meta itemProp="numberOfItems" content={images.length} />

			<div className="col-md-6">
				<Link
					href="#"
					onClick={() => handleImageClick(0)}
					className="lightbox property-detail-main"
					title={firstImage.alt}
					aria-label={`Ver imagem: ${firstImage.alt}`}
				>
					<Image
						src={firstImage.src}
						width={0}
						height={0}
						sizes="100vw"
						className="img-fluid rounded-3 shadow"
						alt={firstImage.alt || `Imóvel: vista principal`}
						itemProp="image"
					/>
				</Link>
			</div>

			<div className="col-md-6">
				<div className="row g-2">
					{images.slice(1, 5).map((img, idx) => (
						<div
							className="col-6"
							key={idx + 1}
							itemScope
							itemType="https://schema.org/ImageObject"
						>
							<Link
								href="#"
								onClick={() => handleImageClick(idx + 1)}
								className="lightbox property-detail-sub"
								title={img.alt}
								aria-label={`Ver imagem: ${img.alt || `Vista ${idx + 2}`}`}
							>
								<Image
									src={img.src}
									width={0}
									height={0}
									sizes="100vw"
									className="img-fluid rounded-3 shadow"
									alt={img.alt || `Imóvel: vista ${idx + 2}`}
									itemProp="contentUrl"
								/>

								<meta itemProp="name" content={img.alt || `Vista ${idx + 2}`} />
								<meta itemProp="position" content={idx + 2} />
							</Link>
						</div>
					))}
				</div>
			</div>
			{open && (
				<Lightbox
					mainSrc={currentImage.src}
					prevSrc={
						images[(currentImageIndex + images.length - 1) % images.length].src
					}
					nextSrc={images[(currentImageIndex + 1) % images.length].src}
					onCloseRequest={() => setIsOpen(false)}
					onMovePrevRequest={handleMovePrev}
					onMoveNextRequest={handleMoveNext}
					imageTitle={currentImage.alt}
				/>
			)}
		</div>
	);
}
