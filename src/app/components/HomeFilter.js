"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { categories, prices } from "../storage/filters";

import { getBaseUrl } from "../helper/utils";

const Select = dynamic(() => import("react-select"), { ssr: false });

import { FiDollarSign, FiHome, FiSearch } from "../assets/icons/vander";

export default function HomeFilter() {
	const [category, setCategory] = React.useState(null);
	const [search, setSearch] = React.useState("");
	const [minPrice, setMinPrice] = React.useState(null);
	const [maxPrice, setMaxPrice] = React.useState(null);

	const categoryOptions = React.useMemo(
		() =>
			categories.map((category) => ({
				value: category.id,
				label: category.label,
			})),
		[]
	);

	const router = useRouter();

	const handleSubmit = (e) => {
		e.preventDefault();

		const filters = {};

		if (search) {
			filters["q"] = search;
		}

		if (category) {
			filters["categoria"] = category.value;
		}

		if (minPrice && minPrice.value > 0) {
			filters["preco-min"] = minPrice.value;
		}

		if (maxPrice && maxPrice.value < 9999999999) {
			filters["preco-max"] = maxPrice.value;
		}

		if (Object.keys(filters).length === 0) {
			Swal.fire({
				icon: "error",
				title: "Selecione pelo menos um filtro para continuar.",
				showConfirmButton: false,
				timer: 2500,
			});
			return;
		}

		router.push(`/imoveis?${new URLSearchParams(filters)}`);
	};

	return (
		<div className="row justify-content-center">
			<div className="col-12 mt-sm-0 pt-sm-0">
				<div className="features-absolute">
					<div className="tab-content bg-white rounded-3 shadow">
						<div className="card border-0 active">
							<form
								onSubmit={handleSubmit}
								className="card-body text-start"
								role="search"
								aria-label="Busca de imóveis"
								itemScope
								itemType="https://schema.org/WebSite"
							>
								<meta itemProp="url" content={getBaseUrl()} />

								<div
									className="registration-form text-dark text-start"
									itemProp="potentialAction"
									itemScope
									itemType="https://schema.org/SearchAction"
								>
									<meta
										itemProp="target"
										content={`${getBaseUrl()}/imoveis?q=${search}`}
									/>

									<div className="row g-lg-0">
										<div className="col-lg-3 col-md-6 col-12">
											<div className="mb-3">
												<label className="form-label fs-6">Busca :</label>
												<div className="filter-search-form position-relative filter-border">
													<FiSearch className="fea icon-ex-md icons" />
													<input
														name="q"
														type="text"
														className="form-control filter-input-box bg-light border-0"
														placeholder="O que você está procurando?"
														aria-label="O que você está procurando?"
														value={search}
														onChange={(e) => setSearch(e.target.value)}
														itemProp="query-input"
													/>
												</div>
											</div>
										</div>

										<div className="col-lg-3 col-md-6 col-12">
											<div className="mb-3">
												<label className="form-label fs-6">Categorias :</label>
												<div className="filter-search-form position-relative filter-border bg-light">
													<FiHome className="fea icon-ex-md icons" />
													<Select
														className="form-input filter-input-box bg-gray-50 dark:bg-slate-800 border-0"
														options={categoryOptions}
														placeholder="Selecione uma categoria"
														aria-label="Selecione uma categoria"
														value={category}
														onChange={(selectedOption) =>
															setCategory(selectedOption)
														}
													/>
												</div>
											</div>
										</div>

										<div className="col-lg-3 col-md-6 col-12">
											<div className="mb-3">
												<label className="form-label fs-6">
													Preço Mínimo :
												</label>
												<div className="filter-search-form position-relative filter-border bg-light">
													<FiDollarSign className="fea icon-ex-md icons" />
													<Select
														className="form-input filter-input-box bg-gray-50 dark:bg-slate-800 border-0"
														options={prices}
														placeholder="Selecione preço mínimo"
														aria-label="Selecione preço mínimo"
														value={minPrice}
														onChange={(selectedOption) =>
															setMinPrice(selectedOption)
														}
													/>
												</div>
											</div>
										</div>

										<div className="col-lg-3 col-md-6 col-12">
											<div className="mb-3">
												<label className="form-label fs-6">
													Preço Máximo :
												</label>
												<div className="filter-search-form position-relative filter-border bg-light">
													<FiDollarSign className="fea icon-ex-md icons" />
													<Select
														className="form-input filter-input-box bg-gray-50 dark:bg-slate-800 border-0"
														options={prices}
														placeholder="Selecione preço máximo"
														aria-label="Selecione preço máximo"
														value={maxPrice}
														onChange={(selectedOption) =>
															setMaxPrice(selectedOption)
														}
													/>
												</div>
											</div>
										</div>

										<div className="col-lg-3 col-md-6 col-12">
											<input
												type="submit"
												id="search"
												name="search"
												style={{ height: "48px" }}
												className="btn btn-primary searchbtn w-100"
												value="Buscar imóveis"
												aria-label="Buscar imóveis"
												itemProp="query-input-button"
											/>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
