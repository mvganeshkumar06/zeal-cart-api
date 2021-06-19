const express = require("express");
const router = express.Router();
const categories = require("../models/categories");
const products = require("../models/products");

router.get("/", async (req, res) => {
	try {
		const allCategories = await categories
			.find({})
			.populate("products", "_id name imageUrl");
		res.json(allCategories);
	} catch (error) {
		res.status(500).json({ errorMessage: error.message });
	}
});

router.post("/", async (req, res) => {
	try {
		const category = await new categories(req.body);

		await products.updateMany(
			{ category: { $exists: false } },
			{ category: category._id }
		);

		const productsToAddCategory = await products.find({
			category: category._id,
		});

		productsToAddCategory.forEach((product) => {
			category.products.push(product._id);
		});

		await category.save();
		res.json(category);
	} catch (error) {
		res.status(500).json({ errorMessage: error.message });
	}
});

module.exports = router;
