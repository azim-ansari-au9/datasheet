const mongoose = require("mongoose");

const carrierSchema = new mongoose.Schema({
	companyName: { type: String },
});

module.exports = mongoose.model("Carrier", carrierSchema);
