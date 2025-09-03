export default function FaqTabContent({
	title,
	id,
	activeIndex,
	setActiveIndex,
	children,
	titleProps = {},
	contentWrapperProps = {},
}) {
	return (
		<div className="accordion-item border-0 rounded-3 shadow mb-4">
			<h2 className="accordion-header">
				<button
					className={`accordion-button border-0 bg-white ${
						activeIndex === id ? "" : "collapsed"
					}`}
					type="button"
					onClick={() => setActiveIndex(activeIndex === id ? 0 : id)}
					{...titleProps}
				>
					{title}
				</button>
			</h2>
			<div
				className={`accordion-collapse border-0 collapse ${
					activeIndex === id ? "show" : ""
				}`}
				{...contentWrapperProps}
			>
				<div className="accordion-body">{children}</div>
			</div>
		</div>
	);
}
