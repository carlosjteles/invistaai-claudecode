"use client";
import Link from "next/link";
import Image from "next/image";

import { getSiteName } from "../helper/utils";

export default function Error() {
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<section className="position-relative bg-soft-primary">
			<div className="container">
				<div className="row">
					<div className="col-12 p-0">
						<div className="d-flex flex-column min-vh-100 justify-content-center px-md-5 py-5 px-4">
							<div className="text-center">
								<Link href="/">
									<Image
										src="/images/logo-icon-64.png"
										width={64}
										height={64}
										alt="Logo"
									/>
								</Link>
							</div>
							<div className="title-heading text-center my-auto">
								<Image
									src="/images/error.png"
									width={200}
									height={200}
									className="img-fluid"
									alt="Error"
								/>
								<h1 className="mb-3 mt-5 text-dark">Pagina não encontrada</h1>

								<p className="text-muted mb-0">
									Infelizmente a página que você está procurando não existe.
								</p>
								<p className="text-muted">
									Ela pode ter sido removida, ter seu nome alterado ou estar
									temporariamente indisponível.
								</p>

								<div className="mt-4 mb-4">
									<Link href="/" className="btn btn-primary">
										Voltar para Página Inicial
									</Link>
								</div>
							</div>
							<div className="text-center">
								<p className="mb-0 text-muted d-flex flex-wrap justify-content-center align-items-end gap-2">
									Todos os direitos reservados.{" "}
									<Link href="#" className="text-reset" onClick={scrollToTop}>
										{getSiteName()}
									</Link>
									<Link
										href="https://www.damcdeveloper.com/"
										target="_blank"
										className="text-reset d-none"
										aria-label="Desenvolvido por DAMC"
									>
										<Image
											src="/images/damc.png"
											alt="DAMC Developer"
											className="img-fluid"
											height={30}
											width={101}
										/>
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
