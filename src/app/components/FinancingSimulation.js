"use client";
import React from "react";

import { NumericFormat } from "react-number-format";

import Swal from "sweetalert2";
import Mdi from "./Mdi";

export default function FinancingSimulation() {
	const [currentStep, setCurrentStep] = React.useState(1);
	const [loading, setLoading] = React.useState(false);
	const [formData, setFormData] = React.useState({
		renda: "",
		compor: "",
		comporValor: "",
		filhos: "",
		fgts: "",
		fgtsValor: "",
		comporFgts: "",
		comporFgtsValor: "",
		ocupacao: [],
		ocupacao2: [],
		nome: "",
		numero: "",
		email: "",
	});
	const [resultData, setResultData] = React.useState(null);

	// Tabela de valores do cálculo de financiamento
	const tableOfValues = {
		1700.0: [101211.0, 493.0, 55000.0, 16500.0],
		1800.0: [107612.0, 523.0, 52097.0, 15629.0],
		1900.0: [114012.0, 553.0, 46491.0, 13947.0],
		2000.0: [121085.0, 583.0, 41266.0, 12380.0],
		2100.0: [127521.0, 613.0, 36415.0, 10924.0],
		2200.0: [129683.0, 643.0, 32192.0, 9657.0],
		2300.0: [135914.0, 673.0, 28037.0, 8411.0],
		2400.0: [142145.0, 703.0, 24227.0, 7268.0],
		2500.0: [148377.0, 733.0, 20752.0, 6225.0],
		2600.0: [154608.0, 763.0, 17604.0, 5281.0],
		2700.0: [160839.0, 793.0, 14774.0, 4432.0],
		2800.0: [167070.0, 823.0, 12254.0, 3676.0],
		2900.0: [157806.0, 853.0, 10253.0, 3076.0],
		3000.0: [163655.0, 883.0, 8290.0, 2487.0],
		3100.0: [169505.0, 913.0, 6612.0, 1983.0],
		3200.0: [174469.0, 943.0, 5212.0, 1563.0],
		3300.0: [180289.0, 973.0, 4080.0, 1224.0],
		3400.0: [186109.0, 1003.0, 3208.0, 962.0],
		3500.0: [191929.0, 1033.0, 2589.0, 776.0],
		3600.0: [186078.0, 1063.0, 2271.0, 681.0],
		3700.0: [191555.0, 1093.0, 2129.0, 638.0],
		3800.0: [197031.0, 1123.0, 2105.0, 631.0],
		3900.0: [202507.0, 1153.0, 2099.0, 629.0],
		4000.0: [207984.0, 1183.0, 2099.0, 629.0],
		4100.0: [190155.0, 1213.0, 2142.0, 642.0],
		4200.0: [195034.0, 1243.0, 2121.0, 636.0],
		4300.0: [199912.0, 1273.0, 2100.0, 630.0],
		4400.0: [204790.0, 1303.0, 2099.0, 629.0],
		4500.0: [209669.0, 1333.0, 2099.0, 629.0],
		4600.0: [187761.0, 1357.0, 0.0, 0.0],
		4700.0: [192068.0, 1387.0, 0.0, 0.0],
		4800.0: [196375.0, 1417.0, 0.0, 0.0],
		4900.0: [200682.0, 1447.0, 0.0, 0.0],
		5000.0: [204990.0, 1477.0, 0.0, 0.0],
		5100.0: [209297.0, 1507.0, 0.0, 0.0],
		5200.0: [213604.0, 1537.0, 0.0, 0.0],
		5300.0: [217911.0, 1567.0, 0.0, 0.0],
		5400.0: [222219.0, 1597.0, 0.0, 0.0],
		5500.0: [226526.0, 1627.0, 0.0, 0.0],
		5600.0: [230833.0, 1657.0, 0.0, 0.0],
		5700.0: [235140.0, 1687.0, 0.0, 0.0],
		5800.0: [239447.0, 1717.0, 0.0, 0.0],
		5900.0: [243755.0, 1747.0, 0.0, 0.0],
		6000.0: [248062.0, 1777.0, 0.0, 0.0],
		6100.0: [252369.0, 1807.0, 0.0, 0.0],
		6200.0: [256676.0, 1837.0, 0.0, 0.0],
		6300.0: [260984.0, 1867.0, 0.0, 0.0],
		6400.0: [265291.0, 1897.0, 0.0, 0.0],
		6500.0: [269598.0, 1927.0, 0.0, 0.0],
		6600.0: [273905.0, 1957.0, 0.0, 0.0],
		6700.0: [278213.0, 1987.0, 0.0, 0.0],
		6800.0: [280000.0, 2000.0, 0.0, 0.0],
		6900.0: [280000.0, 2000.0, 0.0, 0.0],
		7000.0: [280000.0, 2000.0, 0.0, 0.0],
		7100.0: [280000.0, 2000.0, 0.0, 0.0],
		7200.0: [280000.0, 2000.0, 0.0, 0.0],
		7300.0: [280000.0, 2000.0, 0.0, 0.0],
		7400.0: [280000.0, 2000.0, 0.0, 0.0],
		7500.0: [280000.0, 2000.0, 0.0, 0.0],
		7600.0: [280000.0, 2000.0, 0.0, 0.0],
		7700.0: [280000.0, 2000.0, 0.0, 0.0],
		7800.0: [280000.0, 2000.0, 0.0, 0.0],
		7900.0: [280000.0, 2000.0, 0.0, 0.0],
		8000.0: [280000.0, 2000.0, 0.0, 0.0],
		8100.0: [280000.0, 2000.0, 0.0, 0.0],
		8200.0: [280000.0, 2000.0, 0.0, 0.0],
		8300.0: [280000.0, 2000.0, 0.0, 0.0],
		8400.0: [280000.0, 2000.0, 0.0, 0.0],
		8500.0: [280000.0, 2000.0, 0.0, 0.0],
		8600.0: [280000.0, 2000.0, 0.0, 0.0],
		8700.0: [289213.0, 2578.0, 0.0, 0.0],
		8800.0: [292659.0, 2608.0, 0.0, 0.0],
		8900.0: [296106.0, 2638.0, 0.0, 0.0],
		9000.0: [299552.0, 2668.0, 0.0, 0.0],
		9100.0: [302998.0, 2698.0, 0.0, 0.0],
		9200.0: [306445.0, 2728.0, 0.0, 0.0],
		9300.0: [309891.0, 2758.0, 0.0, 0.0],
		9400.0: [313338.0, 2788.0, 0.0, 0.0],
		9500.0: [316784.0, 2818.0, 0.0, 0.0],
		9600.0: [257572.0, 2848.0, 0.0, 0.0],
		9700.0: [323677.0, 2878.0, 0.0, 0.0],
		9800.0: [327123.0, 2908.0, 0.0, 0.0],
		9900.0: [330570.0, 2938.0, 0.0, 0.0],
		10000.0: [334016.0, 2968.0, 0.0, 0.0],
		10100.0: [337462.0, 2998.0, 0.0, 0.0],
		10200.0: [340909.0, 3028.0, 0.0, 0.0],
		10300.0: [344355.0, 3058.0, 0.0, 0.0],
		10400.0: [347802.0, 3088.0, 0.0, 0.0],
		10500.0: [351248.0, 3118.0, 0.0, 0.0],
		10600.0: [354694.0, 3148.0, 0.0, 0.0],
		10700.0: [358141.0, 3178.0, 0.0, 0.0],
		10800.0: [361587.0, 3208.0, 0.0, 0.0],
		10900.0: [365034.0, 3238.0, 0.0, 0.0],
		11000.0: [368480.0, 3268.0, 0.0, 0.0],
		11100.0: [371926.0, 3298.0, 0.0, 0.0],
		11200.0: [375373.0, 3328.0, 0.0, 0.0],
		11300.0: [378819.0, 3358.0, 0.0, 0.0],
		11400.0: [382266.0, 3388.0, 0.0, 0.0],
		11500.0: [385712.0, 3418.0, 0.0, 0.0],
		11600.0: [389158.0, 3448.0, 0.0, 0.0],
		11700.0: [392605.0, 3478.0, 0.0, 0.0],
		11800.0: [396051.0, 3508.0, 0.0, 0.0],
		11900.0: [399498.0, 3538.0, 0.0, 0.0],
		12000.0: [400000.0, 3542.0, 0.0, 0.0],
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleOptionSelect = (name, value) => {
		setFormData({
			...formData,
			[name]: value,
		});

		if (name === "compor") {
			if (value === "sim") {
				setFormData((prev) => ({
					...prev,
					[name]: value,
					comporValor: prev.comporValor || "",
				}));
			} else {
				setFormData((prev) => ({
					...prev,
					[name]: value,
					comporValor: "",
					comporFgts: "",
					comporFgtsValor: "",
				}));
			}
		}

		if (name === "fgts") {
			if (value === "sim") {
				setFormData((prev) => ({
					...prev,
					[name]: value,
					fgtsValor: prev.fgtsValor || "",
				}));
			} else {
				setFormData((prev) => ({
					...prev,
					[name]: value,
					fgtsValor: "",
				}));
			}
		}

		if (name === "comporFgts") {
			if (value === "sim") {
				setFormData((prev) => ({
					...prev,
					[name]: value,
					comporFgtsValor: prev.comporFgtsValor || "",
				}));
			} else {
				setFormData((prev) => ({
					...prev,
					[name]: value,
					comporFgtsValor: "",
				}));
			}
		}
	};

	const formatPhone = (e) => {
		let value = e.target.value.replace(/\D/g, "");

		if (value.length > 11) {
			value = value.slice(0, 11);
		}

		if (value.length >= 11) {
			value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
		} else if (value.length >= 10) {
			value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
		} else if (value.length >= 6) {
			value = value.replace(/^(\d{2})(\d{4})/, "($1) $2-");
		} else if (value.length >= 2) {
			value = value.replace(/^(\d{2})/, "($1) ");
		}

		setFormData({
			...formData,
			numero: value,
		});
	};

	const formatCurrency = (number) => {
		if (isNaN(number)) return "R$ 0,00";
		return `R$ ${number
			.toFixed(2)
			.replace(".", ",")
			.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
	};

	const parseNumber = (str) => {
		if (typeof str === "number") return str;
		if (!str) return 0;
		return parseFloat(
			str.replace(/\./g, "").replace(",", ".").replace("R$", "").trim()
		);
	};

	// Steps validation
	const validateStep1 = () => {
		if (!formData.renda) {
			Swal.fire({
				icon: "error",
				title: "Por favor, informe sua renda mensal.",
				showConfirmButton: false,
				timer: 2500,
			});
			return false;
		}

		if (!formData.compor) {
			Swal.fire({
				icon: "error",
				title: "Por favor, selecione se vai juntar renda com alguém.",
				showConfirmButton: false,
				timer: 2500,
			});
			return false;
		}

		if (formData.compor === "sim" && !formData.comporValor) {
			Swal.fire({
				icon: "error",
				title: "Por favor, informe a renda da outra pessoa.",
				showConfirmButton: false,
				timer: 2500,
			});
			return false;
		}

		if (!formData.filhos) {
			Swal.fire({
				icon: "error",
				title: "Por favor, selecione se possui dependentes.",
				showConfirmButton: false,
				timer: 2500,
			});
			return false;
		}

		return true;
	};

	const validateStep2 = () => {
		if (!formData.fgts) {
			Swal.fire({
				icon: "error",
				title: "Por favor, selecione se possui FGTS.",
				showConfirmButton: false,
				timer: 2500,
			});
			return false;
		}

		if (formData.fgts === "sim" && !formData.fgtsValor) {
			Swal.fire({
				icon: "error",
				title: "Por favor, informe o valor do FGTS.",
				showConfirmButton: false,
				timer: 2500,
			});
			return false;
		}

		if (formData.compor === "sim") {
			if (!formData.comporFgts) {
				Swal.fire({
					icon: "error",
					title: "Por favor, selecione se a outra pessoa possui FGTS.",
					showConfirmButton: false,
					timer: 2500,
				});
				return false;
			}

			if (formData.comporFgts === "sim" && !formData.comporFgtsValor) {
				Swal.fire({
					icon: "error",
					title: "Por favor, informe o valor do FGTS da outra pessoa.",
					showConfirmButton: false,
					timer: 2500,
				});
				return false;
			}
		}

		return true;
	};

	const validateStep3 = () => {
		if (formData.ocupacao.length === 0) {
			Swal.fire({
				icon: "error",
				title: "Por favor, selecione pelo menos uma ocupação.",
				showConfirmButton: false,
				timer: 2500,
			});
			return false;
		}

		return true;
	};

	const validateStep4 = () => {
		if (formData.ocupacao2.length === 0) {
			Swal.fire({
				icon: "error",
				title:
					"Por favor, selecione pelo menos uma ocupação para a outra pessoa.",
				showConfirmButton: false,
				timer: 2500,
			});
			return false;
		}

		return true;
	};

	const validateStep5 = () => {
		if (!formData.nome) {
			Swal.fire({
				icon: "error",
				title: "Por favor, informe seu nome.",
				showConfirmButton: false,
				timer: 2500,
			});
			return false;
		}

		if (!formData.numero) {
			Swal.fire({
				icon: "error",
				title: "Por favor, informe seu número de telefone.",
				showConfirmButton: false,
				timer: 2500,
			});
			return false;
		}

		const numeroTelefone = formData.numero.replace(/\D/g, "");
		if (numeroTelefone.length !== 11) {
			Swal.fire({
				icon: "error",
				title: "Por favor, informe um número de telefone válido com DDD.",
				showConfirmButton: false,
				timer: 2500,
			});
			return false;
		}

		if (!formData.email) {
			Swal.fire({
				icon: "error",
				title: "Por favor, informe seu e-mail.",
				showConfirmButton: false,
				timer: 2500,
			});
			return false;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(formData.email)) {
			Swal.fire({
				icon: "error",
				title: "Por favor, informe um e-mail válido.",
				showConfirmButton: false,
				timer: 2500,
			});
			return false;
		}

		return true;
	};

	const advanceStep = () => {
		switch (currentStep) {
			case 1:
				if (validateStep1()) setCurrentStep(2);
				break;
			case 2:
				if (validateStep2()) setCurrentStep(3);
				break;
			case 3:
				if (validateStep3()) {
					if (formData.compor === "sim") {
						setCurrentStep(4);
					} else {
						setCurrentStep(5);
					}
				}
				break;
			case 4:
				if (validateStep4()) setCurrentStep(5);
				break;
			case 5:
				if (validateStep5()) calculateResult();
				break;
		}
	};

	const voltarEtapa = () => {
		if (currentStep === 4) {
			setCurrentStep(3);
		} else if (currentStep === 5) {
			if (formData.compor === "sim") {
				setCurrentStep(4);
			} else {
				setCurrentStep(3);
			}
		} else {
			setCurrentStep(currentStep - 1);
		}
	};

	const calculateResult = () => {
		setLoading(true);

		setTimeout(() => {
			const renda = parseNumber(formData.renda);
			const fgts =
				formData.fgts === "sim" ? parseNumber(formData.fgtsValor) : 0;
			const comporRenda =
				formData.compor === "sim" ? parseNumber(formData.comporValor) : 0;
			const comporFgts =
				formData.comporFgts === "sim"
					? parseNumber(formData.comporFgtsValor)
					: 0;

			const totalRenda = renda + comporRenda;
			const totalFgts = fgts + comporFgts;

			let financiamento = 0;
			let parcelas = 0;
			let subsidio = 0;

			const valores = tableOfValues;
			const sortedKeys = Object.keys(valores)
				.map(Number)
				.sort((a, b) => a - b);

			for (let i = sortedKeys.length - 1; i >= 0; i--) {
				const key = sortedKeys[i];
				if (totalRenda >= key) {
					const value = valores[key];
					financiamento = value[0];
					parcelas = value[1];
					// Subsídio: se NÃO tem dependentes e NÃO compõe renda, pega value[3], senão value[2]
					if (formData.filhos === "nao" && formData.compor === "nao") {
						subsidio = value[3];
					} else {
						subsidio = value[2];
					}
					break;
				}
			}

			// Encontrar o valor mais próximo na tabela
			for (const [key, value] of Object.entries(tableOfValues).reverse()) {
				if (totalRenda >= parseFloat(key)) {
					financiamento = value[0];
					parcelas = value[1];
					subsidio =
						formData.filhos === "nao" && formData.compor === "nao"
							? value[3]
							: value[2];
					break;
				}
			}

			const totalFinanciamento = financiamento + totalFgts + subsidio;

			setResultData({
				totalRenda,
				financiamento,
				parcelas,
				subsidio,
				totalFinanciamento,
				totalFgts,
			});

			setLoading(false);
			setCurrentStep(6);

			// Enviar dados para o formulário
			sendForm(totalRenda, totalFinanciamento, parcelas, subsidio);
		}, 2000);
	};

	// Enviar dados para formulário externo
	const sendForm = (totalRenda, totalFinanciamento, parcelas, subsidio) => {
		const data = {
			"renda-principal": formatCurrency(parseNumber(formData.renda)),
			"fgts-principal": formData.fgts,
			"fgts-principal-valor": formatCurrency(parseNumber(formData.fgtsValor)),
			dependentes: formData.filhos,
			"tem-renda-secundaria": formData.compor,
			"renda-secundaria": formatCurrency(parseNumber(formData.comporValor)),
			"fgts-secundario": formData.comporFgts,
			"fgts-secundario-valor": formatCurrency(
				parseNumber(formData.comporFgtsValor)
			),
			nome: formData.nome,
			numero: `"${formData.numero}"`,
			email: formData.email,
			"data-envio": new Date().toLocaleDateString("pt-BR"),
			"hora-envio": new Date().toLocaleTimeString("pt-BR"),
			empresa: "Cidade Villa-Lobos Maestro",
			"total-renda": formatCurrency(totalRenda),
			"total-financiamento": formatCurrency(totalFinanciamento),
			parcelas: formatCurrency(parcelas),
			subsidio: `"${formatCurrency(subsidio)}"`,
			"ocupacao-principal": formData.ocupacao.join(", "),
			"ocupacao-secundaria": formData.ocupacao2.join(", "),
		};

		fetch("https://formspree.io/f/mldnpalb", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Success:", data);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	};

	const openWhatsapp = () => {
		window.open("https://api.whatsapp.com/send/?phone=5511978777584", "_blank");
	};

	const clearForm = () => {
		setCurrentStep(1);
		setResultData(null);
		setFormData({
			renda: "",
			compor: "",
			comporValor: "",
			filhos: "",
			fgts: "",
			fgtsValor: "",
			comporFgts: "",
			comporFgtsValor: "",
			ocupacao: [],
			ocupacao2: [],
			nome: "",
			numero: "",
			email: "",
		});
	};

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-12">
					{/* Etapa 1: Informações iniciais */}
					{currentStep === 1 && (
						<div>
							<div className="section-title text-center mb-3">
								<h5 className="mb-3">
									Vamos simular o seu poder de financiamento?
								</h5>
							</div>

							<div className="mb-4">
								<label htmlFor="renda" className="form-label text-dark">
									Informe sua renda mensal
								</label>
								<NumericFormat
									className="form-control"
									id="renda"
									name="renda"
									value={formData.renda}
									onValueChange={(values) => {
										setFormData({
											...formData,
											renda: values.floatValue || "",
										});
									}}
									thousandSeparator="."
									decimalSeparator=","
									prefix="R$ "
									decimalScale={2}
									placeholder="R$ 1.000,00"
									required
								/>
							</div>

							<div className="mb-4">
								<label className="form-label text-dark">
									Vai juntar renda com mais alguém?
									<br />
									<small className="text-muted">
										Pode ser um familiar, Namorado(a), Esposo(a) ou até mesmo um
										Amigo.
									</small>
								</label>
								<div className="d-flex gap-3 justify-content-center mt-2">
									<button
										type="button"
										className={`btn ${
											formData.compor === "sim"
												? "btn-primary"
												: "btn-outline-primary"
										}`}
										onClick={() => handleOptionSelect("compor", "sim")}
									>
										Sim
									</button>
									<button
										type="button"
										className={`btn ${
											formData.compor === "nao"
												? "btn-primary"
												: "btn-outline-primary"
										}`}
										onClick={() => handleOptionSelect("compor", "nao")}
									>
										Não
									</button>
								</div>
							</div>

							{formData.compor === "sim" && (
								<div className="mb-4">
									<label htmlFor="comporValor" className="form-label">
										Qual a Renda Comprovada da Outra Pessoa:
									</label>
									<NumericFormat
										className="form-control"
										id="comporValor"
										name="comporValor"
										value={formData.comporValor}
										onValueChange={(values) => {
											setFormData({
												...formData,
												comporValor: values.floatValue || "",
											});
										}}
										thousandSeparator="."
										decimalSeparator=","
										prefix="R$ "
										decimalScale={2}
										placeholder="R$ 1.000,00"
										required
									/>
								</div>
							)}

							<div className="mb-4">
								<label className="form-label text-dark">
									Você Possui Dependente(s)
								</label>
								<div className="d-flex gap-3 justify-content-center mt-2">
									<button
										type="button"
										className={`btn ${
											formData.filhos === "sim"
												? "btn-primary"
												: "btn-outline-primary"
										}`}
										onClick={() => handleOptionSelect("filhos", "sim")}
									>
										Sim
									</button>
									<button
										type="button"
										className={`btn ${
											formData.filhos === "nao"
												? "btn-primary"
												: "btn-outline-primary"
										}`}
										onClick={() => handleOptionSelect("filhos", "nao")}
									>
										Não
									</button>
								</div>
							</div>

							<div className="text-center mt-4">
								<button onClick={advanceStep} className="btn btn-primary">
									Próximo Passo
								</button>
							</div>
						</div>
					)}

					{/* Etapa 2: Informações de FGTS */}
					{currentStep === 2 && (
						<div>
							<div className="section-title text-center mb-3">
								<h5 className="mb-3">Informações de FGTS</h5>
							</div>

							<div className="mb-4">
								<label className="form-label text-dark">
									Você Possui FGTS?
								</label>
								<div className="d-flex gap-3 justify-content-center mt-2">
									<button
										type="button"
										className={`btn ${
											formData.fgts === "sim"
												? "btn-primary"
												: "btn-outline-primary"
										}`}
										onClick={() => handleOptionSelect("fgts", "sim")}
									>
										Sim
									</button>
									<button
										type="button"
										className={`btn ${
											formData.fgts === "nao"
												? "btn-primary"
												: "btn-outline-primary"
										}`}
										onClick={() => handleOptionSelect("fgts", "nao")}
									>
										Não
									</button>
								</div>
							</div>

							{formData.fgts === "sim" && (
								<div className="mb-4">
									<label htmlFor="fgtsValor" className="form-label">
										Qual o valor do seu FGTS?
									</label>
									<NumericFormat
										className="form-control"
										id="fgtsValor"
										name="fgtsValor"
										value={formData.fgtsValor}
										onValueChange={(values) => {
											setFormData({
												...formData,
												fgtsValor: values.floatValue || "",
											});
										}}
										thousandSeparator="."
										decimalSeparator=","
										prefix="R$ "
										decimalScale={2}
										placeholder="R$ 1.000,00"
										required
									/>
								</div>
							)}

							{formData.compor === "sim" && (
								<>
									<div className="mb-4">
										<label className="form-label text-dark">
											A Outra Pessoa Possui FGTS?
										</label>
										<div className="d-flex gap-3 justify-content-center mt-2">
											<button
												type="button"
												className={`btn ${
													formData.comporFgts === "sim"
														? "btn-primary"
														: "btn-outline-primary"
												}`}
												onClick={() => handleOptionSelect("comporFgts", "sim")}
											>
												Sim
											</button>
											<button
												type="button"
												className={`btn ${
													formData.comporFgts === "nao"
														? "btn-primary"
														: "btn-outline-primary"
												}`}
												onClick={() => handleOptionSelect("comporFgts", "nao")}
											>
												Não
											</button>
										</div>
									</div>

									{formData.comporFgts === "sim" && (
										<div className="mb-4">
											<label htmlFor="comporFgtsValor" className="form-label">
												Qual o valor do FGTS da outra pessoa?
											</label>
											<NumericFormat
												className="form-control"
												id="comporFgtsValor"
												name="comporFgtsValor"
												value={formData.comporFgtsValor}
												onValueChange={(values) => {
													setFormData({
														...formData,
														comporFgtsValor: values.floatValue || "",
													});
												}}
												thousandSeparator="."
												decimalSeparator=","
												prefix="R$ "
												decimalScale={2}
												placeholder="R$ 1.000,00"
												required
											/>
										</div>
									)}
								</>
							)}

							<div className="d-flex justify-content-between mt-4">
								<button
									onClick={voltarEtapa}
									className="btn btn-outline-secondary px-4"
								>
									Voltar
								</button>
								<button onClick={advanceStep} className="btn btn-primary px-4">
									Próximo
								</button>
							</div>
						</div>
					)}

					{/* Etapa 3: Ocupação Principal */}
					{currentStep === 3 && (
						<div>
							<div className="section-title text-center mb-3">
								<h5 className="mb-0">Qual é a Sua Ocupação de Trabalho?</h5>
								<small className="text-muted mx-auto">
									(se necessário pode selecionar mais de 1 opção)
								</small>
							</div>

							<div className="row justify-content-center">
								<div className="col-md-8">
									<div className="mb-3 form-check">
										<input
											type="checkbox"
											className="form-check-input"
											id="ocupacao-clt"
											value="Trabalho Registrado(CLT)"
											checked={formData.ocupacao.includes(
												"Trabalho Registrado(CLT)"
											)}
											onChange={(e) => {
												const isChecked = e.target.checked;
												setFormData({
													...formData,
													ocupacao: isChecked
														? [...formData.ocupacao, "Trabalho Registrado(CLT)"]
														: formData.ocupacao.filter(
																(item) => item !== "Trabalho Registrado(CLT)"
														  ),
												});
											}}
										/>
										<label
											className="form-check-label fw-bold"
											htmlFor="ocupacao-clt"
										>
											Trabalho Registrado(CLT)
										</label>
									</div>

									<div className="mb-3 form-check">
										<input
											type="checkbox"
											className="form-check-input"
											id="ocupacao-publico"
											value="Funcionário(a) Público"
											checked={formData.ocupacao.includes(
												"Funcionário(a) Público"
											)}
											onChange={(e) => {
												const isChecked = e.target.checked;
												setFormData({
													...formData,
													ocupacao: isChecked
														? [...formData.ocupacao, "Funcionário(a) Público"]
														: formData.ocupacao.filter(
																(item) => item !== "Funcionário(a) Público"
														  ),
												});
											}}
										/>
										<label
											className="form-check-label fw-bold"
											htmlFor="ocupacao-publico"
										>
											Funcionário(a) Público
										</label>
									</div>

									<div className="mb-3 form-check">
										<input
											type="checkbox"
											className="form-check-input"
											id="ocupacao-aposentado"
											value="Aposentado(a)"
											checked={formData.ocupacao.includes("Aposentado(a)")}
											onChange={(e) => {
												const isChecked = e.target.checked;
												setFormData({
													...formData,
													ocupacao: isChecked
														? [...formData.ocupacao, "Aposentado(a)"]
														: formData.ocupacao.filter(
																(item) => item !== "Aposentado(a)"
														  ),
												});
											}}
										/>
										<label
											className="form-check-label fw-bold"
											htmlFor="ocupacao-aposentado"
										>
											Aposentado(a)
										</label>
									</div>

									<div className="mb-3 form-check">
										<input
											type="checkbox"
											className="form-check-input"
											id="ocupacao-autonomo"
											value="Autônomo ou MEI"
											checked={formData.ocupacao.includes("Autônomo ou MEI")}
											onChange={(e) => {
												const isChecked = e.target.checked;
												setFormData({
													...formData,
													ocupacao: isChecked
														? [...formData.ocupacao, "Autônomo ou MEI"]
														: formData.ocupacao.filter(
																(item) => item !== "Autônomo ou MEI"
														  ),
												});
											}}
										/>
										<label
											className="form-check-label fw-bold"
											htmlFor="ocupacao-autonomo"
										>
											Autônomo ou MEI
										</label>
									</div>
								</div>
							</div>

							<div className="d-flex justify-content-between mt-4">
								<button
									onClick={voltarEtapa}
									className="btn btn-outline-secondary px-4"
								>
									Voltar
								</button>
								<button onClick={advanceStep} className="btn btn-primary px-4">
									Próximo
								</button>
							</div>
						</div>
					)}

					{/* Etapa 4: Ocupação Secundária */}
					{currentStep === 4 && (
						<div>
							<div className="section-title text-center mb-3">
								<h5 className="mb-0">
									Qual é a Ocupação de Trabalho da Outra Pessoa
								</h5>
								<small className="text-muted mx-auto">
									(se necessário pode selecionar mais de 1 opção)
								</small>
							</div>

							<div className="row justify-content-center">
								<div className="col-md-8">
									<div className="mb-3 form-check">
										<input
											type="checkbox"
											className="form-check-input"
											id="ocupacao2-clt"
											value="Trabalho Registrado(CLT)"
											checked={formData.ocupacao2.includes(
												"Trabalho Registrado(CLT)"
											)}
											onChange={(e) => {
												const isChecked = e.target.checked;
												setFormData({
													...formData,
													ocupacao2: isChecked
														? [
																...formData.ocupacao2,
																"Trabalho Registrado(CLT)",
														  ]
														: formData.ocupacao2.filter(
																(item) => item !== "Trabalho Registrado(CLT)"
														  ),
												});
											}}
										/>
										<label
											className="form-check-label fw-bold"
											htmlFor="ocupacao2-clt"
										>
											Trabalho Registrado(CLT)
										</label>
									</div>

									<div className="mb-3 form-check">
										<input
											type="checkbox"
											className="form-check-input"
											id="ocupacao2-publico"
											value="Funcionário(a) Público"
											checked={formData.ocupacao2.includes(
												"Funcionário(a) Público"
											)}
											onChange={(e) => {
												const isChecked = e.target.checked;
												setFormData({
													...formData,
													ocupacao2: isChecked
														? [...formData.ocupacao2, "Funcionário(a) Público"]
														: formData.ocupacao2.filter(
																(item) => item !== "Funcionário(a) Público"
														  ),
												});
											}}
										/>
										<label
											className="form-check-label fw-bold"
											htmlFor="ocupacao2-publico"
										>
											Funcionário(a) Público
										</label>
									</div>

									<div className="mb-3 form-check">
										<input
											type="checkbox"
											className="form-check-input"
											id="ocupacao2-aposentado"
											value="Aposentado(a)"
											checked={formData.ocupacao2.includes("Aposentado(a)")}
											onChange={(e) => {
												const isChecked = e.target.checked;
												setFormData({
													...formData,
													ocupacao2: isChecked
														? [...formData.ocupacao2, "Aposentado(a)"]
														: formData.ocupacao2.filter(
																(item) => item !== "Aposentado(a)"
														  ),
												});
											}}
										/>
										<label
											className="form-check-label fw-bold"
											htmlFor="ocupacao2-aposentado"
										>
											Aposentado(a)
										</label>
									</div>

									<div className="mb-3 form-check">
										<input
											type="checkbox"
											className="form-check-input"
											id="ocupacao2-autonomo"
											value="Autônomo ou MEI"
											checked={formData.ocupacao2.includes("Autônomo ou MEI")}
											onChange={(e) => {
												const isChecked = e.target.checked;
												setFormData({
													...formData,
													ocupacao2: isChecked
														? [...formData.ocupacao2, "Autônomo ou MEI"]
														: formData.ocupacao2.filter(
																(item) => item !== "Autônomo ou MEI"
														  ),
												});
											}}
										/>
										<label
											className="form-check-label fw-bold"
											htmlFor="ocupacao2-autonomo"
										>
											Autônomo ou MEI
										</label>
									</div>
								</div>
							</div>

							<div className="d-flex justify-content-between mt-4">
								<button
									onClick={voltarEtapa}
									className="btn btn-outline-secondary px-4"
								>
									Voltar
								</button>
								<button onClick={advanceStep} className="btn btn-primary px-4">
									Próximo
								</button>
							</div>
						</div>
					)}

					{/* Etapa 5: Informações de Contato */}
					{currentStep === 5 && (
						<div>
							<div className="section-title text-center mb-3">
								<h5 className="mb-0">
									Seu Potencial de Financiamento, valor de Parcelas será
									processado logo após o envio.
								</h5>
								<small className="text-muted mx-auto">
									Informe seu nome, e-mail e numero WhatsApp para saber o
									resultado!
								</small>
							</div>

							<div className="mb-3">
								<label htmlFor="nome" className="form-label">
									Qual é o Seu Nome?
								</label>
								<input
									type="text"
									className="form-control"
									id="nome"
									name="nome"
									value={formData.nome}
									onChange={handleInputChange}
									placeholder="Seu Nome Completo"
									required
								/>
							</div>

							<div className="mb-3">
								<label htmlFor="numero" className="form-label">
									Seu Número (WhatsApp):
								</label>
								<input
									type="text"
									className="form-control"
									id="numero"
									name="numero"
									value={formData.numero}
									onChange={handleInputChange}
									onBlur={formatPhone}
									placeholder="Insira o número com o DDD"
									required
								/>
							</div>

							<div className="mb-3">
								<label htmlFor="email" className="form-label">
									Qual é o Seu E-mail?
								</label>
								<input
									type="email"
									className="form-control"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									placeholder="Seu e-mail"
									required
								/>
							</div>

							<div className="d-flex justify-content-between mt-4">
								<button
									onClick={voltarEtapa}
									className="btn btn-outline-secondary px-4"
								>
									Voltar
								</button>
								<button onClick={advanceStep} className="btn btn-primary px-4">
									Próximo
								</button>
							</div>
						</div>
					)}

					{/* Tela de Loading */}
					{loading && (
						<div className="card-body p-5 text-center">
							<div
								className="spinner-border text-primary"
								role="status"
								style={{ width: "3rem", height: "3rem" }}
							>
								<span className="visually-hidden">Loading...</span>
							</div>
							<p className="mt-3">
								Calculando seu potencial de financiamento...
							</p>
						</div>
					)}

					{/* Tela de Resultado */}
					{currentStep === 6 && resultData && (
						<div>
							<button
								className="btn btn-sm btn-outline-secondary position-absolute top-0 start-0 m-3"
								onClick={clearForm}
							>
								<Mdi n="arrow-left" /> Voltar
							</button>

							<div className="text-center py-4 mt-5">
								<h4 className="fw-bold text-primary mb-4">
									Resultado da Simulação
								</h4>

								<div className="p-3 mb-4 bg-light rounded-3">
									<p className="fw-bold text-primary">Renda Total</p>
									<h5 className="display-6">
										{formatCurrency(resultData.totalRenda)}
									</h5>
								</div>

								<div className="row mb-3">
									<div className="col-12 mb-2">
										<div className="p-3 h-100 rounded-3">
											<p className="mb-0">
												<strong>Dependentes:</strong>{" "}
												{formData.filhos === "sim" ? "Sim" : "Não"}
											</p>
										</div>
									</div>
									<div className="col-12 mb-0">
										<div className="p-3 h-100 rounded-3">
											<p className="mb-0">
												<strong>Compor Renda:</strong>{" "}
												{formData.compor === "sim" ? "Sim" : "Não"}
											</p>
										</div>
									</div>

									<div className="col-12 p-3 mb-0 rounded-3">
										<p className="fw-bold">Ocupações:</p>
										<p>{formData.ocupacao.join(", ")}</p>
										{formData.compor === "sim" && (
											<p>{formData.ocupacao2.join(", ")}</p>
										)}
									</div>
								</div>

								<p className="alert alert-success">
									Recebemos suas informações, iremos fazer a simulação e
									retornaremos pelo WhatsApp
								</p>

								<button
									className="btn btn-lg btn-primary mt-4 d-flex align-items-center mx-auto"
									onClick={openWhatsapp}
								>
									<Mdi n="whatsapp" className="me-2" /> Falar com o Corretor
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
