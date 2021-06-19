const express = require("express");
const router = express.Router();
const users = require("../models/users");
const wishlists = require("../models/wishlists");
const carts = require("../models/carts");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
	try {
		const allUsers = await users
			.find({})
			.populate("wishlist")
			.populate("cart");
		res.json(allUsers);
	} catch (error) {
		res.status(404).json({ errorMessage: error.message });
	}
});

router.post("/signup", async (req, res) => {
	try {
		const isUserExisting = await users.findOne({ userName: req.body.userName });
		if (isUserExisting) {
			return res.status(409).json({ errorMessage: "Username already exists, please try a different username" });
		}
		req.body.password = await bcrypt.hash(req.body.password, 10);
		const user = await new users(req.body);
		const userWishlist = await new wishlists({
			userId: user._id,
			products: [],
		});
		const userCart = await new carts({
			userId: user._id,
			products: [],
		});
		await userWishlist.save();
		await userCart.save();
		await user.save();
		res.json(user.id);
	} catch (error) {
		res.status(500).json({ errorMessage: error.message });
	}
});

router.post("/login", async (req, res) => {
	const { userName, password } = req.body;
	const user = await users.findOne({ userName: userName });
	if (!user) {
		return res
			.status(401)
			.json({ errorMessage: "Wrong username, please try again" });
	}
	const isAuthenticated = await bcrypt.compare(password, user.password);

	if (isAuthenticated) {
		const accessToken = jwt.sign({ id: user._id, name: userName }, process.env.SERVER_SECRET);
		return res.json({ accessToken });
	}
	res.status(401).json({ errorMessage: "Wrong password, please try again" });
});

module.exports = router;
