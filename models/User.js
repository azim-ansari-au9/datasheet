const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstName: { type: String },
	dob: { type: Date },
	address: { type: String },
	phoneNumber: { type: String },
	state: { type: String },
	zipCode: { type: String },
	email: { type: String },
	gender: { type: String },
	userType: { type: String },
});

module.exports = mongoose.model("User", userSchema);
