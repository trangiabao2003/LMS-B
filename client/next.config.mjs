/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
		],
		unoptimized: true,
	},
	// experimental: {
	// 	reactRoot: true,
	// 	suppressHydrationWarning: true,
	// },
};

export default nextConfig;
