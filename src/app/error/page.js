import Link from "next/link";
import Image from "next/image";

import { getSiteName } from "../helper/Utils";

export default function Error() {
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
								<p className="mb-0 text-muted">
									© {new Date().getFullYear()} {getSiteName()}. Desenvolvido por{" "}
									<Link
										href="https://www.damcdeveloper.com/"
										target="_blank"
										className="text-reset"
									>
										DAMC
									</Link>
									.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
