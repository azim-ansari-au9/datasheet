const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
	policyNumber: { type: String },
	startDate: { type: Date },
	endDate: { type: Date },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Policycategory" },
	carrierId: { type: mongoose.Schema.Types.ObjectId, ref: "Carrier" },
});

module.exports = mongoose.model("Policy", policySchema);
