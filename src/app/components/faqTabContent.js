export default function FaqTabContent({
	id,
	title,
	activeIndex,
	setActiveIndex,
	children,
}) {
	return (
		<>
			<div className="accordion-item rounded-3 mb-3">
				<h2 className="accordion-header" id="headingOne">
					<button
						className={`accordion-button border-0 bg-light ${
							activeIndex === id ? "active" : ""
						}`}
						onClick={() => setActiveIndex(id)}
					>
						{title}
					</button>
				</h2>
				{activeIndex === id && (
					<div id="collapseOne" className="accordion-collapse border-0">
						<div className="accordion-body text-muted">{children}</div>
					</div>
				)}
			</div>
		</>
	);
}
