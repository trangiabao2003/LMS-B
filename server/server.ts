import { app } from "./app";
import cloudinary from "cloudinary";
import http from "http";
import connectDB from "./utils/db";
import { initSocketServer } from "./socketServer";
require("dotenv").config();

const server = http.createServer(app);

initSocketServer(server);

//cloudinary config
cloudinary.v2.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_SECRET_KEY,
});


// create server
server.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
	connectDB();
});
