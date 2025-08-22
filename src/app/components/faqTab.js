"use client";

import React from "react";
import { Link as Link2 } from "react-scroll";
import FaqTabContent from "./faqTabContent";

import { BsDot } from "../assets/icons/vander";

import { data, titles } from "../storage/faqs";

export default function FaqTab() {
	const [activeIndexes, setActiveIndexes] = React.useState(
		Array(data.length).fill(1)
	);

	return (
		<div className="row justify-content-center">
			<div className="col-lg-4 col-md-5 col-12 d-none d-md-block">
				<div className="rounded-3 shadow p-4 sticky-bar">
					<ul className="list-unstyled sidebar-nav mb-0 py-0" id="navmenu-nav">
						{titles.map(({ title, to }, index) => {
							return (
								<li
									className={`navbar-item p-0 ${index > 0 ? "ms-0 mt-3" : ""}`}
									key={index}
								>
									<Link2
										to={to}
										spy={true}
										activeclassname="active"
										smooth={true}
										offset={-100}
										duration={500}
										className="h6 text-dark navbar-link"
									>
										{title}
									</Link2>
								</li>
							);
						})}
					</ul>
				</div>
			</div>

			<div className="col-lg-8 col-md-7 col-12">
				{data.map((section, sectionIdx) => (
					<div id={section.sectionId} key={section.sectionId}>
						<div className="section-title">
							<h4>{section.sectionTitle}</h4>
						</div>
						<div className="accordion mt-4 pt-2">
							{section.contents.map((item) => (
								<FaqTabContent
									key={item.id}
									id={item.id}
									title={item.title}
									activeIndex={activeIndexes[sectionIdx]}
									setActiveIndex={(idx) => {
										const newIndexes = [...activeIndexes];
										newIndexes[sectionIdx] = idx;
										setActiveIndexes(newIndexes);
									}}
								>
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
												<ul className="list-unstyled text-dark mb-3" key={idx}>
													{block.items.map((li, liIdx) => (
														<li className="ms-0 mt-2" key={liIdx}>
															<BsDot className="fea icon-sm me-2" />
															<span
																dangerouslySetInnerHTML={{ __html: li.value }}
															/>
														</li>
													))}
												</ul>
											);
										}
										return null;
									})}
								</FaqTabContent>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
