import mongoose, { set } from "mongoose";
require("dotenv").config();

const dbURL = process.env.DB_URL || "";

const connectDB = async () => {
	try {
		await mongoose.connect(dbURL).then((data: any) => {
			console.log(`MongoDB connected with server: ${data.connection.host}`);
		});
	} catch (error: any) {
		console.log(error.message);
		setTimeout(connectDB, 5000); // Retry connection after 5 seconds
	}
};
export default connectDB;
