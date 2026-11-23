"use client";
import React from "react";

// Chave pública do widget Turnstile (Cloudflare). Pode ser trocada pela variável NEXT_PUBLIC_TURNSTILE_SITE_KEY.
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAFxV94l7i_lhbsDC";

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function carregarScript() {
	if (typeof window === "undefined") return Promise.resolve();
	if (window.turnstile) return Promise.resolve();
	if (window.__turnstileCarregando) return window.__turnstileCarregando;
	window.__turnstileCarregando = new Promise((resolve, reject) => {
		const s = document.createElement("script");
		s.src = SRC;
		s.async = true;
		s.defer = true;
		s.onload = () => resolve();
		s.onerror = () => reject(new Error("turnstile"));
		document.head.appendChild(s);
	});
	return window.__turnstileCarregando;
}

/**
 * Verificação anti-robô do Cloudflare (Turnstile). Na maioria das vezes é invisível;
 * chama onToken(token) quando o visitante é validado e onToken("") quando o token expira.
 * Use o ref para reset() depois de enviar.
 */
const Turnstile = React.forwardRef(function Turnstile({ onToken, className = "" }, ref) {
	const caixa = React.useRef(null);
	const widget = React.useRef(null);

	React.useImperativeHandle(ref, () => ({
		reset: () => {
			try {
				if (window.turnstile && widget.current !== null) window.turnstile.reset(widget.current);
			} catch (e) {}
			onToken?.("");
		},
	}));

	React.useEffect(() => {
		let ativo = true;
		carregarScript()
			.then(() => {
				if (!ativo || !caixa.current || !window.turnstile || widget.current !== null) return;
				widget.current = window.turnstile.render(caixa.current, {
					sitekey: TURNSTILE_SITE_KEY,
					language: "pt-BR",
					appearance: "interaction-only",
					callback: (t) => onToken?.(t),
					"expired-callback": () => onToken?.(""),
					"error-callback": () => onToken?.(""),
				});
			})
			.catch(() => {});
		return () => {
			ativo = false;
			try {
				if (window.turnstile && widget.current !== null) window.turnstile.remove(widget.current);
			} catch (e) {}
			widget.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div ref={caixa} className={className} />;
});

export default Turnstile;
