require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./database/connection");
const productsRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const usersRoutes = require("./routes/users");
const wishlistsRoutes = require("./routes/wishlists");
const cartsRoutes = require("./routes/carts");
const verifyAccessToken = require("./middlewares/verify-access-token");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectToDatabase();

app.use("/products", productsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/users", usersRoutes);
app.use("/wishlists", verifyAccessToken, wishlistsRoutes);
app.use("/carts", verifyAccessToken, cartsRoutes);

app.get("/", (req, res) => {
	res.send("Zeal Cart API is running...");
});

app.get("*", (req, res) => {
	res.status(404).send({ errorMessage: "Route not found" });
});

app.listen(port, () => {
	console.log(`Server started at port ${port}`);
});
