import React from "react";
import { contact } from "../storage/about";

/**
 * Bloco visível de responsável pela página. Acompanha o nó Person do JSON-LD:
 * o Google espera que o sinal de autoria também apareça para o leitor.
 */
export default function AutorPagina({ descricao = null, atualizadoEm = null }) {
	return (
		<div className="border rounded-3 p-3 mt-4">
			<p className="fw-semibold mb-1">
				{contact.broker.name}
				<span className="text-muted fw-normal"> · CRECI-SP {contact.broker.creci}</span>
			</p>
			<p className="text-muted small mb-1">
				{descricao ||
					"Corretor de imóveis especializado em lançamentos e imóveis de alto padrão em São Paulo. Responsável pelas informações desta página."}
			</p>
			{atualizadoEm && (
				<p className="text-muted small mb-0">Página atualizada em {atualizadoEm}.</p>
			)}
		</div>
	);
}
