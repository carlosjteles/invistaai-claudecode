"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

import { FiHome, FiCamera } from "../assets/icons/vander";

const TinySlider = dynamic(() => import("tiny-slider-react"), { ssr: false });
import "../../../node_modules/tiny-slider/dist/tiny-slider.css";

import { formatPrice } from "../helper/formatter";
import { getBaseUrl } from "../helper/utils";
import Mdi from "./Mdi";
import PropertyCard from "./PropertyCard";

const settings = {
	container: ".tiny-slide-three",
	controls: true,
	mouseDrag: true,
	loop: true,
	rewind: true,
	autoplay: true,
	autoplayButtonOutput: false,
	autoplayTimeout: 3000,
	navPosition: "bottom",
	controlsText: [
		'<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/></svg>',
		'<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>',
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

export default function RelatedPropertySlider({ propertyData }) {
	const [ready, setReady] = React.useState(false);

	React.useEffect(() => {
		setReady(true);
	}, []);

	const slides = propertyData.map((item, index) => {
				const thumbnail = item.images?.[0] || null;

				return (
					<div
						className="tiny-slide"
						key={index}
						itemProp="itemListElement"
						itemScope
						itemType="https://schema.org/ListItem"
					>
						<meta itemProp="position" content={index + 1} />
						<meta itemProp="url" content={`${getBaseUrl()}/imovel/${item.slug}`} />
						<meta itemProp="name" content={item.name} />

						<PropertyCard item={item} className="m-2" />
					</div>
				);
			});

	return (
		<div className="row" itemScope itemType="https://schema.org/ItemList">
			<meta itemProp="name" content="Imóveis Relacionados" />
			<meta itemProp="numberOfItems" content={propertyData.length} />
			<meta itemProp="itemListOrder" content="Unordered" />

			<div className="col-12">
				<div className="tiny-slide-three">
					{ready ? (
						<TinySlider settings={settings}>{slides}</TinySlider>
					) : (
						<div className="row">
							{slides.map((slide, index) => (
								<div className="col-lg-4 col-md-6 col-12" key={index}>
									{slide}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
