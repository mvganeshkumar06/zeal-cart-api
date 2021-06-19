const express = require("express");
const router = express.Router();
const wishlists = require("../models/wishlists");

router.get("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const userWishlist = await wishlists
			.findOne({ user: userId })
			.populate("user", "_id")
			.populate(
				"products",
				"_id name price imageUrl category trending rating"
			);
		res.json(userWishlist.products);
	} catch (error) {
		res.status(400).json({ errorMessage: error.message });
	}
});

router.post("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const { productId } = req.body;

		const userWishlist = await wishlists.findOne({
			user: userId,
		});

		const userWishlistProducts = userWishlist.products;

		const userWishlistedProduct = userWishlistProducts.find(
			(_id) => _id.toString() === productId
		);

		if (userWishlistedProduct) {
			const updatedUserWishlistProducts = userWishlistProducts.filter(
				(_id) => _id.toString() !== productId
			);
			userWishlist.products = updatedUserWishlistProducts;
			await userWishlist.save();
			const userWishlistPopulated = await userWishlist
				.populate(
					"products",
					"_id name price imageUrl category trending rating"
				)
				.execPopulate();
			return res.json(userWishlistPopulated.products);
		}

		userWishlistProducts.push(productId);
		await userWishlist.save();
		const userWishlistPopulated = await userWishlist
			.populate(
				"products",
				"_id name price imageUrl category trending rating"
			)
			.execPopulate();
		res.json(userWishlistPopulated.products);
	} catch (error) {
		res.status(500).json({ errorMessage: error.message });
	}
});

module.exports = router;
