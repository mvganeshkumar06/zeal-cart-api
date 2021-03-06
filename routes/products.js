const express = require("express");
const router = express.Router();
const products = require("../models/products");

router.get("/", async (req, res) => {
	try {
		const allProducts = await products
			.find({})
			.select("_id name price imageUrl category trending rating")
			.populate("category", "_id name");
		res.json(allProducts);
	} catch (error) {
		res.json({ errorMessage: error.message });
	}
});

router.get("/:productId", async (req, res) => {
	try {
		const { productId } = req.params;
		const product = await products
			.findById(productId)
			.populate("category", "_id name");
		return res.json(product);
	} catch (error) {
		res.status(400).json({
			errorMessage: "Can't find a product with the given id",
		});
	}
});

router.post("/", async (req, res) => {
	try {
		const product = await new products(req.body);
		await product.save();
		res.json(product);
	} catch (error) {
		res.status(500).json({ errorMessage: error.message });
	}
});

module.exports = router;
