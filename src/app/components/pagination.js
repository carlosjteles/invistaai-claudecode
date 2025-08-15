export default function Pagination({
	currentPage,
	setCurrentPage,
	totalPages,
}) {
	const handlePageChange = (event, page) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}

		event.currentTarget.blur();
	};

	return (
		<div className="row">
			<div className="col-12 mt-4 pt-2">
				<ul className="pagination justify-content-center mb-0">
					<li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
						<button
							className="page-link"
							onClick={(event) => handlePageChange(event, currentPage - 1)}
							aria-label="Anterior"
						>
							<span aria-hidden="true">
								<i className="mdi mdi-chevron-left fs-6"></i>
							</span>
						</button>
					</li>
					{Array.from({ length: totalPages }, (_, i) => (
						<li
							key={i}
							className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
						>
							<button
								className="page-link"
								onClick={(event) => handlePageChange(event, i + 1)}
							>
								{i + 1}
							</button>
						</li>
					))}
					<li
						className={`page-item ${
							currentPage === totalPages ? "disabled" : ""
						}`}
					>
						<button
							className="page-link"
							onClick={(event) => handlePageChange(event, currentPage + 1)}
							aria-label="Próximo"
						>
							<span aria-hidden="true">
								<i className="mdi mdi-chevron-right fs-6"></i>
							</span>
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
}
