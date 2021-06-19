const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categoriesSchema = new Schema({
	name: {
		type: String,
		required: [true, "Category name is required"],
	},
	products: [
		{
			type: Schema.Types.ObjectId,
			ref: "products",
		},
	],
});

const categories = model("categories", categoriesSchema);

module.exports = categories;
