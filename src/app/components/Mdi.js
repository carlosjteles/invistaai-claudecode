import {
	MdArrowBack,
	MdArrowForward,
	MdBed,
	MdChevronLeft,
	MdChevronRight,
	MdDirectionsCar,
	MdFormatQuote,
	MdOpenInFull,
	MdShower,
	MdStar,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

// Ícones em SVG no lugar da fonte Material Design Icons (que pesava ~390 KB).
// O tamanho segue o font-size da classe (fs-4, fs-5…) e a cor segue o texto.
const ICONES = {
	"arrow-left": MdArrowBack,
	"arrow-right": MdArrowForward,
	"arrow-expand-all": MdOpenInFull,
	bed: MdBed,
	car: MdDirectionsCar,
	"chevron-left": MdChevronLeft,
	"chevron-right": MdChevronRight,
	"format-quote-open": MdFormatQuote,
	shower: MdShower,
	star: MdStar,
	whatsapp: FaWhatsapp,
};

export default function Mdi({ n, className = "", style, ...rest }) {
	const Icone = ICONES[n];
	if (!Icone) return null;
	return (
		<Icone
			className={className}
			style={{ verticalAlign: "-0.125em", ...style }}
			aria-hidden="true"
			focusable="false"
			{...rest}
		/>
	);
}
