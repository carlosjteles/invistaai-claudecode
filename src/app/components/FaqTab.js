"use client";

import React from "react";
import { Link as Link2 } from "react-scroll";
import FaqTabContent from "./FaqTabContent";

import { BsDot } from "../assets/icons/vander";

import { data, titles } from "../storage/faqs";

export default function FaqTab() {
	const [activeIndexes, setActiveIndexes] = React.useState(
		Array(data.length).fill(1)
	);

	return (
		<div
			className="row justify-content-center"
			itemScope
			itemType="https://schema.org/FAQPage"
		>
			<div className="col-lg-4 col-md-5 col-12 d-none d-md-block">
				<div
					className="rounded-3 shadow p-4 sticky-bar"
					itemScope
					itemType="https://schema.org/ItemList"
				>
					<meta itemProp="name" content="Categorias de Perguntas Frequentes" />
					<meta itemProp="numberOfItems" content={titles.length} />

					<ul className="list-unstyled sidebar-nav mb-0 py-0" id="navmenu-nav">
						{titles.map(({ title, to }, index) => {
							return (
								<li
									className={`navbar-item p-0 ${index > 0 ? "ms-0 mt-3" : ""}`}
									key={index}
									itemProp="itemListElement"
									itemScope
									itemType="https://schema.org/ListItem"
								>
									<meta itemProp="position" content={index + 1} />

									<Link2
										to={to}
										spy={true}
										activeclassname="active"
										smooth={true}
										offset={-100}
										duration={500}
										className="h6 text-dark navbar-link"
										role="button"
										itemProp="url"
									>
										<span itemProp="name">{title}</span>
									</Link2>
								</li>
							);
						})}
					</ul>
				</div>
			</div>

			<div className="col-lg-8 col-md-7 col-12">
				{data.map((section, sectionIdx) => (
					<div
						id={section.sectionId}
						key={section.sectionId}
						itemScope
						itemType="https://schema.org/ItemList"
					>
						<meta itemProp="name" content={section.sectionTitle} />
						<meta itemProp="numberOfItems" content={section.contents.length} />

						<div className="section-title">
							<h4 itemProp="headline">{section.sectionTitle}</h4>
						</div>
						<div className="accordion mt-4 pt-2">
							{section.contents.map((item, itemIdx) => (
								<div
									key={item.id}
									itemScope
									itemType="https://schema.org/Question"
									itemProp="itemListElement"
								>
									<meta itemProp="position" content={itemIdx + 1} />

									<FaqTabContent
										id={item.id}
										title={item.title}
										titleProps={{ itemProp: "name" }}
										activeIndex={activeIndexes[sectionIdx]}
										setActiveIndex={(idx) => {
											const newIndexes = [...activeIndexes];
											newIndexes[sectionIdx] = idx;
											setActiveIndexes(newIndexes);
										}}
										contentWrapperProps={{
											itemScope: true,
											itemType: "https://schema.org/Answer",
											itemProp: "acceptedAnswer",
										}}
									>
										<div itemProp="text">
											{item.content.map((block, idx) => {
												if (block.type === "text") {
													return (
														<div
															className="text-dark"
															key={idx}
															dangerouslySetInnerHTML={{ __html: block.value }}
														/>
													);
												}
												if (block.type === "subtitle") {
													return (
														<span className="fw-bold text-dark mb-0" key={idx}>
															{block.value}
														</span>
													);
												}
												if (block.type === "list") {
													return (
														<ul
															className="list-unstyled text-dark mb-3"
															key={idx}
														>
															{block.items.map((li, liIdx) => (
																<li className="ms-0 mt-2" key={liIdx}>
																	<BsDot className="fea icon-sm me-2" />
																	<span
																		dangerouslySetInnerHTML={{
																			__html: li.value,
																		}}
																	/>
																</li>
															))}
														</ul>
													);
												}
												return null;
											})}
										</div>
									</FaqTabContent>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
