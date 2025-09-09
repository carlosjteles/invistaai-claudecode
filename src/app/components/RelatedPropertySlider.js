"use client";
import dynamic from "next/dynamic";

const TinySlider = dynamic(() => import("tiny-slider-react"), { ssr: false });
import "../../../node_modules/tiny-slider/dist/tiny-slider.css";

import FeaturedPropertyCard from "./FeaturedPropertyCard";

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

export default function RelatedPropertySlider({ propertyData }) {
	return (
		<div className="row">
			<meta itemProp="name" content="Imóveis Relacionados" />
			<meta itemProp="numberOfItems" content={propertyData.length} />
			<meta itemProp="itemListOrder" content="Unordered" />

			<div className="col-12">
				<div className="tiny-slide-three">
					<TinySlider settings={settings}>
						{propertyData.map((item, index) => {
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

									<FeaturedPropertyCard
										item={item}
										thumbnail={thumbnail}
										cardCss="m-2"
									/>
								</div>
							);
						})}
					</TinySlider>
				</div>
			</div>
		</div>
	);
}
