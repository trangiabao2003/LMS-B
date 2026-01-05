"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Props = {
	videoUrl: string;
	title: string;
};

const playerKey = process.env.NEXT_PUBLIC_VDOCIPHER_PLAYER_ID;

const CoursePlayer = ({ videoUrl, title }: Props) => {
	const [videoData, setVideoData] = useState({
		otp: "",
		playbackInfo: "",
	});

	useEffect(() => {
		axios
			.post(`${process.env.NEXT_PUBLIC_SERVER_URI}getVdoCipherOTP`, {
				videoId: videoUrl,
			})
			.then((res) => {
				setVideoData(res.data);
			});
	}, [videoUrl]);

	return (
		<div className="relative w-full aspect-video overflow-hidden bg-black">
			{videoData.otp && videoData.playbackInfo && (
				<iframe
					src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=${playerKey}`}
					className="absolute top-0 left-0 w-full h-full object-cover"
					allowFullScreen
					allow="encrypted-media"
					style={{ border: "none" }}
				/>
			)}
		</div>
	);
};

export default CoursePlayer;
