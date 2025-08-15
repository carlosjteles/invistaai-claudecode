"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import Lightbox from "react-18-image-lightbox";
import "../../../node_modules/react-18-image-lightbox/style.css";

export default function PropertyDetailImg() {
	let [currentImageIndex, setCurrentImageIndex] = useState();
	let [open, setIsOpen] = useState(false);
	let images = [
		"/images/property/single/1.jpg",
		"/images/property/single/2.jpg",
		"/images/property/single/3.jpg",
		"/images/property/single/4.jpg",
		"/images/property/single/5.jpg",
	];

	let handleMovePrev = () => {
		setCurrentImageIndex(
			(prevIndex) => (prevIndex + images.length - 1) % images.length
		);
	};

	let handleMoveNext = () => {
		setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
	};

	let handleImageClick = (index) => {
		setCurrentImageIndex(index);
		setIsOpen(true);
	};

	let currentImage = images[currentImageIndex];

	return (
		<div className="row g-2">
			<div className="col-md-6">
				<Link
					href="#"
					onClick={() => handleImageClick(0)}
					className="lightbox"
					title=""
				>
					<Image
						src="/images/property/single/1.jpg"
						width={0}
						height={0}
						sizes="100vw"
						style={{ width: "100%", height: "auto" }}
						className="img-fluid rounded-3 shadow"
						alt=""
					/>
				</Link>
			</div>

			<div className="col-md-6">
				<div className="row g-2">
					<div className="col-6">
						<Link
							href="#"
							onClick={() => handleImageClick(1)}
							className="lightbox"
							title=""
						>
							<Image
								src="/images/property/single/2.jpg"
								width={0}
								height={0}
								sizes="100vw"
								style={{ width: "100%", height: "auto" }}
								className="img-fluid rounded-3 shadow"
								alt=""
							/>
						</Link>
					</div>

					<div className="col-6">
						<Link
							href="#"
							onClick={() => handleImageClick(2)}
							className="lightbox"
							title=""
						>
							<Image
								src="/images/property/single/3.jpg"
								width={0}
								height={0}
								sizes="100vw"
								style={{ width: "100%", height: "auto" }}
								className="img-fluid rounded-3 shadow"
								alt=""
							/>
						</Link>
					</div>

					<div className="col-6">
						<Link
							href="#"
							onClick={() => handleImageClick(3)}
							className="lightbox"
							title=""
						>
							<Image
								src="/images/property/single/4.jpg"
								width={0}
								height={0}
								sizes="100vw"
								style={{ width: "100%", height: "auto" }}
								className="img-fluid rounded-3 shadow"
								alt=""
							/>
						</Link>
					</div>

					<div className="col-6">
						<Link
							href="#"
							onClick={() => handleImageClick(4)}
							className="lightbox"
							title=""
						>
							<Image
								src="/images/property/single/5.jpg"
								width={0}
								height={0}
								sizes="100vw"
								style={{ width: "100%", height: "auto" }}
								className="img-fluid rounded-3 shadow"
								alt=""
							/>
						</Link>
					</div>
				</div>
			</div>
			{open && (
				<Lightbox
					mainSrc={currentImage}
					prevSrc={
						images[(currentImageIndex + images.length - 1) % images.length]
					}
					nextSrc={images[(currentImageIndex + 1) % images.length]}
					onCloseRequest={() => setIsOpen(false)}
					onMovePrevRequest={handleMovePrev}
					onMoveNextRequest={handleMoveNext}
				/>
			)}
		</div>
	);
}
