const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Name field is required"],
		},
		price: {
			type: Number,
			required: [true, "Price field is required"],
		},
		description: {
			type: String,
			required: [true, "Description field is required"],
		},
		imageUrl: {
			type: String,
			required: [true, "Url field is required"],
		},
		features: {
			type: Array,
			required: [true, "Feature field is required"],
		},
		discount: {
			type: String,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: "categories",
		},
		trending: {
			type: Boolean,
			required: [true, "Trending field is required"],
		},
		rating: {
			type: Number,
			default: 0.0,
		},
	},
	{ timestamps: true }
);

const products = model("products", productSchema);

module.exports = products;
