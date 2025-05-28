const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
	agentName: { type: String },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Agent", agentSchema);
