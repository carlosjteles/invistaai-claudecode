import { getVideoId } from "../helper/utils";

export default function YoutubeEmbed({ video }) {
	return (
		<div className="ratio ratio-16x9">
			<iframe
				src={`https://www.youtube-nocookie.com/embed/${getVideoId(video)}`}
				title="YouTube video"
				referrerPolicy="strict-origin-when-cross-origin"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
				className="rounded-3"
				style={{ border: 0, width: "100%", height: "100%" }}
				loading="lazy"
			></iframe>
			<p className="d-none">
				Watch this video on YouTube: https://youtu.be/{getVideoId(video)}
			</p>
		</div>
	);
}
