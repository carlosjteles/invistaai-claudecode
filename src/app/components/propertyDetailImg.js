"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import Lightbox from "react-18-image-lightbox";
import "../../../node_modules/react-18-image-lightbox/style.css";

export default function PropertyDetailImg({ images, openGallery = false }) {
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
		<div className="row g-2">
			<div className="col-md-6">
				<Link
					href="#"
					onClick={() => handleImageClick(0)}
					className="lightbox"
					title={firstImage.title}
				>
					<Image
						src={firstImage.src}
						width={0}
						height={0}
						sizes="100vw"
						style={{ width: "100%", height: "auto" }}
						className="img-fluid rounded-3 shadow"
						alt={firstImage.title}
					/>
				</Link>
			</div>

			<div className="col-md-6">
				<div className="row g-2">
					{images.slice(1, 5).map((img, idx) => (
						<div className="col-6" key={idx + 1}>
							<Link
								href="#"
								onClick={() => handleImageClick(idx + 1)}
								className="lightbox"
								title={img.title}
							>
								<Image
									src={img.src}
									width={0}
									height={0}
									sizes="100vw"
									style={{ width: "100%", height: "auto" }}
									className="img-fluid rounded-3 shadow"
									alt={img.title}
								/>
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
				/>
			)}
		</div>
	);
}
