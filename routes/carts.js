const express = require("express");
const router = express.Router();
const carts = require("../models/carts");
const mongoose = require("mongoose");

router.use("/", async (req, res, next) => {
	const userCart = await carts.findOne({
		user: mongoose.Types.ObjectId(req.user.id),
	});
	if (!userCart) {
		return res
			.status(400)
			.json({ errorMessage: "No user exist with the given id" });
	}
	req.userCart = userCart;
	next();
});

router.get("/:userId", async (req, res) => {
	try {
		const userCart = req.userCart;
		const userCartPopulated = await userCart
			.populate({
				path: "products",
				populate: {
					path: "product",
					select:
						"_id name imageUrl price trending rating category",
				},
			})
			.execPopulate();
		res.json(userCartPopulated.products);
	} catch (error) {
		res.status(400).json({ errorMessage: error.message });
	}
});

router.post("/:userId", async (req, res) => {
	try {
		const userCart = req.userCart;
		const { productId, quantity } = req.body;
		const userCartProducts = userCart.products;

		const productInUserCart = userCartProducts.find(
			({ product }) => product.toString() === productId
		);

		if (productInUserCart) {
			const updatedUserCartProducts = userCartProducts.filter(
				({ product }) => product.toString() !== productId
			);
			userCart.products = updatedUserCartProducts;
			await userCart.save();
			const userCartPopulated = await userCart
				.populate({
					path: "products",
					populate: {
						path: "product",
						select:
							"_id name imageUrl price trending rating category",
					},
				})
				.execPopulate();
			return res.json(userCartPopulated.products);
		}

		userCartProducts.push({
			product: productId,
			quantity: quantity,
		});

		userCart.products = userCartProducts;
		await userCart.save();
		const userCartPopulated = await userCart
			.populate({
				path: "products",
				populate: {
					path: "product",
					select:
						"_id name imageUrl price trending rating category",
				},
			})
			.execPopulate();
		res.json(userCartPopulated.products);
	} catch (error) {
		res.status(500).json({ errorMessage: error.message });
	}
});

router.post("/:userId/updateQuantity", async (req, res) => {
	try {
		const { productId, quantity } = req.body;
		const userCart = req.userCart;
		let userCartItem = userCart.products.find(
			({ product }) => product.toString() === productId
		);

		if (!userCartItem) {
			userCartItem = {
				product: productId,
				quantity: quantity,
			};
		}

		const updatedUserCartProducts = userCart.products.filter(
			({ product }) => product.toString() !== productId
		);

		userCartItem.quantity = quantity;

		if (userCartItem.quantity !== 0) {
			updatedUserCartProducts.push(userCartItem);
		}

		userCart.products = updatedUserCartProducts;
		await userCart.save();
		const userCartPopulated = await userCart
			.populate({
				path: "products",
				populate: {
					path: "product",
					select:
						"_id name imageUrl price trending rating category",
				},
			})
			.execPopulate();
		res.json(userCartPopulated.products);
	} catch (error) {
		res.status(500).json({ errorMessage: error.message });
	}
});

module.exports = router;
