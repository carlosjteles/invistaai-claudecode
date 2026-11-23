import Link from "next/link";

import { getIndicadores } from "../helper/indicadores";

// Cópias do grupo na trilha. A animação desloca a largura de um grupo e
// reinicia, então bastam 2 para o laço não mostrar vazio; 4 dá margem.
// O SCSS não depende deste número — só precisa que seja 2 ou mais.
const REPETICOES = 4;

export default async function FaixaIndicadores() {
	const itens = await getIndicadores();

	// sem dado, sem faixa: melhor nada do que uma tira azul vazia
	if (!itens?.length) return null;

	// indice 0 é o grupo real; os seguintes são cópias para fechar o laço da
	// animação e ficam escondidos do leitor de tela
	const grupo = (indice) => (
		<div
			key={indice}
			className="fi-grupo"
			aria-hidden={indice === 0 ? undefined : "true"}
		>
			{itens.map((item) => {
				const conteudo = (
					<>
						<span className="fi-rotulo">{item.rotulo}</span>
						<span className="fi-valor">{item.valor_texto}</span>
						{/* O valor do mês fica no texto, não no title: celular não tem
						    hover, então em title ele seria invisível para a maior
						    parte dos visitantes. */}
						{item.valor2_texto && (
							<>
								<span className="fi-sep" aria-hidden="true">
									·
								</span>
								<span className="fi-valor2">{item.valor2_texto}</span>
								{item.rotulo2 && (
									<span className="fi-rotulo2">{item.rotulo2}</span>
								)}
							</>
						)}
					</>
				);

				return item.url ? (
					<Link
						key={item.rotulo}
						href={item.url}
						className="fi-item fi-link"
						title={item.detalhe || undefined}
					>
						{conteudo}
					</Link>
				) : (
					<span
						key={item.rotulo}
						className="fi-item"
						title={item.detalhe || undefined}
					>
						{conteudo}
					</span>
				);
			})}
		</div>
	);

	return (
		<aside className="faixa-indicadores" aria-label="Indicadores de mercado">
			<div className="fi-trilha">
				{Array.from({ length: REPETICOES }, (_, i) => grupo(i))}
			</div>
		</aside>
	);
}
