const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const wishlistsSchema = Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "users",
	},
	products: [
		{
			type: Schema.Types.ObjectId,
			ref: "products",
		},
	],
});

const wishlists = model("wishlists", wishlistsSchema);

module.exports = wishlists;
