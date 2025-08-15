import React from "react";
import Link from "next/link";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";

import { contact } from "../storage/data";

import { FiArrowRight } from "../assets/icons/vander";

export default function Privacy() {
	return (
		<>
			<Navbar
				navClassNamclassName="defaultscroll sticky"
				logolight={true}
				menuClass="navigation-menu nav-left nav-light"
			/>
			<section
				className="bg-half-170 d-table w-100"
				style={{ backgroundImage: "url('/images/bg/03.jpg')" }}
			>
				<div className="bg-overlay bg-gradient-overlay-2"></div>
				<div className="container">
					<div className="row mt-5 justify-content-center">
						<div className="col-12">
							<div className="title-heading text-center">
								<h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
									Política de Privacidade
								</h5>
								<p className="text-white-50 para-desc mx-auto mb-0">
									Última atualização: 12/08/2025
								</p>
							</div>
						</div>
					</div>
					<div className="position-middle-bottom">
						<nav aria-label="breadcrumb" className="d-block">
							<ul className="breadcrumb breadcrumb-muted mb-0 p-0">
								<li className="breadcrumb-item">
									<Link href="/">Início</Link>
								</li>
								<li className="breadcrumb-item active" aria-current="page">
									Política de Privacidade
								</li>
							</ul>
						</nav>
					</div>
				</div>
			</section>
			<div className="position-relative">
				<div className="shape overflow-hidden text-white">
					<svg
						viewBox="0 0 2880 48"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
							fill="currentColor"
						></path>
					</svg>
				</div>
			</div>
			<section className="section">
				<div className="container">
					<div className="row justify-content-center">
						<div className="col-lg-9">
							<div className="card shadow rounded-3 border-0">
								<div className="card-body">
									<h5 className="card-title">Visão Geral</h5>
									<p className="text-muted">
										Nós, da InvistaAi, respeitamos a sua privacidade e estamos
										comprometidos em proteger os seus dados pessoais. Esta
										Política de Privacidade explica como coletamos, usamos e
										protegemos as informações que você nos fornece, em
										conformidade com a Lei Geral de Proteção de Dados Pessoais
										(Lei nº 13.709/2018).
									</p>

									<h5 className="card-title mb-1">1. Coleta de Informações</h5>
									<p className="text-muted mb-0">
										Podemos coletar as seguintes informações quando você
										interage com nossos serviços:
									</p>
									<ul className="list-unstyled text-muted">
										<li className="mt-2 ms-0">
											<FiArrowRight className="fea icon-sm me-2" />
											Dados de identificação: nome, e-mail e telefone (quando
											necessário)
										</li>
										<li className="mt-2 ms-0">
											<FiArrowRight className="fea icon-sm me-2" />
											Dados de navegação: endereço IP, tipo de dispositivo,
											navegador, páginas acessadas
										</li>
										<li className="mt-2 ms-0">
											<FiArrowRight className="fea icon-sm me-2" />
											Informações fornecidas voluntariamente: formulários,
											cadastros e mensagens enviadas
										</li>
									</ul>

									<h5 className="card-title mb-1">2. Uso das Informações</h5>
									<p className="text-muted mb-0">
										Seus dados podem ser utilizados para:
									</p>
									<ul className="list-unstyled text-muted">
										<li className="mt-2 ms-0">
											<FiArrowRight className="fea icon-sm me-2" />
											Fornecer e melhorar nossos serviços
										</li>
										<li className="mt-2 ms-0">
											<FiArrowRight className="fea icon-sm me-2" />
											Enviar comunicações importantes sobre atualizações ou
											alterações
										</li>
										<li className="mt-2 ms-0">
											<FiArrowRight className="fea icon-sm me-2" />
											Cumprir obrigações legais e regulatórias
										</li>
										<li className="mt-2 ms-0">
											<FiArrowRight className="fea icon-sm me-2" />
											Realizar análises internas para aprimoramento da
											experiência do usuário
										</li>
									</ul>

									<h5 className="card-title mb-1">
										3. Compartilhamento de Dados
									</h5>
									<p className="text-muted mb-0">
										Não vendemos ou alugamos seus dados pessoais. Podemos
										compartilhar informações com:
									</p>
									<ul className="list-unstyled text-muted">
										<li className="mt-2 ms-0">
											<FiArrowRight className="fea icon-sm me-2" />
											Parceiros e prestadores de serviço essenciais para a
											operação do site
										</li>
										<li className="mt-2 ms-0">
											<FiArrowRight className="fea icon-sm me-2" />
											Autoridades competentes, quando exigido por lei
										</li>
									</ul>

									<h5 className="card-title mb-1">
										4. Segurança das Informações
									</h5>
									<p className="text-muted">
										Adotamos medidas técnicas e organizacionais para proteger
										seus dados contra acesso não autorizado, perda ou uso
										indevido. <br />O acesso é restrito apenas a colaboradores e
										parceiros autorizados.
									</p>

									<h5 className="card-title mb-1">5. Direitos do Titular</h5>
									<p className="text-muted mb-0">Você tem direito a:</p>
									<ul className="list-unstyled text-muted">
										<li className="mt-2 ms-0">
											<FiArrowRight className="fea icon-sm me-2" />
											Confirmar a existência de tratamento de dados
										</li>
										<li className="mt-2 ms-0">
											<FiArrowRight className="fea icon-sm me-2" />
											Acessar, corrigir, atualizar ou excluir suas informações
										</li>
										<li className="mt-2 ms-0">
											<FiArrowRight className="fea icon-sm me-2" />
											Solicitar a portabilidade dos dados
										</li>
										<li className="mt-2 ms-0">
											<FiArrowRight className="fea icon-sm me-2" />
											Revogar o consentimento a qualquer momento
										</li>
									</ul>
									<p className="text-muted">
										Para exercer seus direitos, entre em contato pelo e-mail:{" "}
										<Link
											href={`mailto:${contact.email}`}
											className="text-foot"
										>
											{contact.email}
										</Link>
									</p>

									<h5 className="card-title">6. Alterações na Política</h5>
									<p className="text-muted">
										Podemos atualizar esta Política de Privacidade
										periodicamente. Recomendamos que você consulte esta página
										regularmente para estar ciente das mudanças.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Footer />
			<ScrollTop />
		</>
	);
}
