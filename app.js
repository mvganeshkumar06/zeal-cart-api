require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./database/connection");
const productsRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const usersRoutes = require("./routes/users");
const wishlistsRoutes = require("./routes/wishlists");
const cartsRoutes = require("./routes/carts");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectToDatabase();

app.use("/products", productsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/users", usersRoutes);
app.use("/wishlists", wishlistsRoutes);
app.use("/carts", cartsRoutes);

app.get("/", (req, res) => {
	res.send("Hello world");
});

app.listen(port, () => {
	console.log(`Server started at port ${port}`);
});
