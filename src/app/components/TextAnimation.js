"use client";
import React from "react";
import { TypeAnimation } from "react-type-animation";

export default function TextAnimation() {
	return (
		<h4 className="heading fw-bold text-white title-dark mb-3">
			Vamos ajudar você a encontrar <br /> sua Casa
			<TypeAnimation
				sequence={["dos Sonhos", 1000, "Íncrível", 1000]}
				wrapper="span"
				speed={5}
				repeat={Infinity}
				className="typewrite text-primary ms-2"
				cursor={false}
			/>
		</h4>
	);
}
