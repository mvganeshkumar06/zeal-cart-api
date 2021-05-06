const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const cartsSchema = Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "users",
	},
	products: [
		{
			product: {
				type: Schema.Types.ObjectId,
				ref: "products",
			},
			quantity: {
				type: Number,
				required: [true, "Quantity field is required"],
			},
		},
	],
});

const carts = model("carts", cartsSchema);

module.exports = carts;
