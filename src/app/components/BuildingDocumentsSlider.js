"use client";
import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const Lightbox = dynamic(() => import("react-18-image-lightbox"), {
	ssr: false,
});

const TinySlider = dynamic(() => import("tiny-slider-react"), { ssr: false });

import "../../../node_modules/react-18-image-lightbox/style.css";
import "../../../node_modules/tiny-slider/dist/tiny-slider.css";

const settings = {
	container: ".tiny-slide-three",
	controls: true,
	mouseDrag: true,
	loop: true,
	rewind: true,
	autoplay: false,
	navPosition: "bottom",
	controlsText: [
		'<i class="mdi mdi-chevron-left "></i>',
		'<i class="mdi mdi-chevron-right"></i>',
	],
	nav: false,
	speed: 400,
	gutter: 0,
	responsive: {
		1025: {
			items: 3,
		},

		992: {
			items: 2,
		},

		767: {
			items: 2,
		},

		320: {
			items: 1,
		},
	},
};

export default function BuildingDocumentsSlider({ images }) {
	const thumbnails = React.useMemo(
		() => images.filter((img) => img.thumbnail),
		[images]
	);

	const largeImages = React.useMemo(
		() => images.filter((img) => !img.thumbnail),
		[images]
	);

	const sliderImages = React.useMemo(
		() => (thumbnails.length > 0 ? thumbnails : largeImages),
		[thumbnails, largeImages]
	);

	const [open, setOpen] = React.useState(false);
	const [currentIndex, setCurrentIndex] = React.useState(0);

	const handleImageClick = (index) => {
		const thumbSrc = sliderImages[index].src;
		const baseSrc = thumbSrc.replace("_thumbnail", "");

		const largeIndex = largeImages.findIndex((img) => img.src === baseSrc);

		setCurrentIndex(largeIndex >= 0 ? largeIndex : index);
		setOpen(true);
	};

	const handleMovePrev = () => {
		setCurrentIndex(
			(prevIndex) => (prevIndex + sliderImages.length - 1) % sliderImages.length
		);
	};

	const handleMoveNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
	};

	return (
		<div className="row">
			<meta itemProp="name" content="Documentos do Imóvel" />
			<meta itemProp="numberOfItems" content={sliderImages.length} />
			<meta itemProp="itemListOrder" content="Unordered" />

			<div className="col-12">
				<div className="tiny-slide-three">
					<TinySlider settings={settings}>
						{sliderImages.map((item, index) => {
							return (
								<div
									className="tiny-slide"
									key={index}
									itemProp="itemListElement"
									itemScope
									itemType="https://schema.org/ListItem"
								>
									<meta itemProp="position" content={index + 1} />

									<div
										className="card property border-0 position-relative overflow-hidden rounded-3 m-2"
										itemScope
										itemType="https://schema.org/RealEstateListing"
										style={{
											height: "220px",
										}}
									>
										<div
											className="property-image position-relative overflow-hidden d-flex justify-content-center align-items-center"
											style={{
												height: "100%",
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												padding: "20px",
											}}
											onClick={() => handleImageClick(index)}
											title={item.title}
											aria-label={`Ver imagem: ${item.title}`}
										>
											<Image
												src={item.src}
												width={0}
												height={0}
												sizes="100vw"
												style={{
													maxWidth: "90%",
													maxHeight: "90%",
													width: "auto",
													height: "auto",
													objectFit: "contain",
												}}
												className="img-fluid"
												alt={item.title || `Planta ${index + 1}`}
												itemProp="image"
											/>
										</div>
									</div>
								</div>
							);
						})}
					</TinySlider>
				</div>
			</div>
			{open && largeImages.length > 0 && (
				<Lightbox
					mainSrc={largeImages[currentIndex]?.src}
					prevSrc={
						largeImages[
							(currentIndex + largeImages.length - 1) % largeImages.length
						]?.src
					}
					nextSrc={largeImages[(currentIndex + 1) % largeImages.length]?.src}
					onCloseRequest={() => setOpen(false)}
					onMovePrevRequest={handleMovePrev}
					onMoveNextRequest={handleMoveNext}
					imageTitle={largeImages[currentIndex]?.title}
				/>
			)}
		</div>
	);
}
