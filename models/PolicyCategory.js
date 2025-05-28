const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
	categoryName: { type: String },
});

module.exports = mongoose.model("Policycategory", categorySchema);
