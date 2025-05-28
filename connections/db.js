const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
console.log("process.env.DATABASE_URI:::", process.env.DATABASE_URI)
const mongoConnectionInitialize = () => {
	try {
		mongoose.connect(process.env.DATABASE_URI, {
			// useNewUrlParser: true,
			// useUnifiedTopology: true,
			serverSelectionTimeoutMS: 30000, // 30 seconds
		});
		console.log("MongoDB connected successfully");
		// mongoose.connection.once("open", () => {
		// 	console.log("MongoDB connected successfully");
		// 	mongoose.disconnect();
		// });
	} catch (error) {
		console.error("MongoDB connection failed:", error.message);
		process.exit(1);
	}
};

module.exports = { mongoConnectionInitialize };
