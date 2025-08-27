import React from "react";

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

	if (totalPages <= 1) return null;

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

					{Array.from({ length: totalPages }, (_, i) => i + 1)
						.filter(
							(pageNum) =>
								pageNum === 1 ||
								pageNum === totalPages ||
								Math.abs(pageNum - currentPage) <= 1
						)
						.map((pageNum, i, array) => {
							if (i > 0 && array[i] - array[i - 1] > 1) {
								return (
									<React.Fragment key={`ellipsis-${pageNum}`}>
										<li className="page-item disabled">
											<span className="page-link">...</span>
										</li>
										<li
											className={`page-item ${
												currentPage === pageNum ? "active" : ""
											}`}
										>
											<button
												className="page-link"
												onClick={(event) => handlePageChange(event, pageNum)}
											>
												{pageNum}
											</button>
										</li>
									</React.Fragment>
								);
							}

							return (
								<li
									key={pageNum}
									className={`page-item ${
										currentPage === pageNum ? "active" : ""
									}`}
								>
									<button
										className="page-link"
										onClick={(event) => handlePageChange(event, pageNum)}
									>
										{pageNum}
									</button>
								</li>
							);
						})}

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
