import { getVideoId } from "../helper/utils";

export default function YoutubeEmbed({ video }) {
	return (
		<div className="ratio ratio-16x9">
			<iframe
				src={`https://www.youtube.com/embed/${getVideoId(video)}`}
				title="YouTube video"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
				className="rounded-3"
				style={{ border: 0, width: "100%", height: "100%" }}
				loading="lazy"
			></iframe>
		</div>
	);
}
