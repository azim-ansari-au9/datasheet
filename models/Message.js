const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	message: { type: String },
	day: { type: String }, // example: "Monday"
	time: { type: String }, // example: "14:30"
	inserted: { type: Boolean },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Message", messageSchema);
