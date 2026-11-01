"use client";
import React from "react";
import { TypeAnimation } from "react-type-animation";

export default function TextAnimation() {
	return (
		<h1 className="heading fw-bold text-white title-dark mb-3">
			Apartamentos de alto padrão <br />
			<TypeAnimation
				sequence={[
					"em São Paulo", 1800,
					"nos Jardins", 1800,
					"em Moema", 1800,
					"no Itaim Bibi", 1800,
					"em Pinheiros", 1800,
					"na Vila Nova Conceição", 1800,
				]}
				wrapper="span"
				speed={40}
				deletionSpeed={60}
				repeat={Infinity}
				className="typewrite text-primary"
				cursor={false}
			/>
		</h1>
	);
}
