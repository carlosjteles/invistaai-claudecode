"use client";
import React from "react";
import { TypeAnimation } from "react-type-animation";

export default function TextAnimation() {
	return (
		<h1 className="heading fw-bold text-white title-dark mb-3">
			Apartamentos de alto padrão{" "}
			{/* Linha com altura reservada e sem quebra: a troca dos bairros não empurra o resto da página */}
			<span
				className="d-block"
				style={{ minHeight: "1.25em", whiteSpace: "nowrap" }}
			>
				<TypeAnimation
					sequence={[
						"em São Paulo", 2500,
						"nos Jardins", 2500,
						"em Moema", 2500,
						"no Itaim Bibi", 2500,
						"em Pinheiros", 2500,
					]}
					wrapper="span"
					speed={45}
					deletionSpeed={70}
					repeat={Infinity}
					className="typewrite text-primary"
					cursor={false}
				/>
			</span>
		</h1>
	);
}
