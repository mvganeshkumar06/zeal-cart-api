const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { isEmail, isMobilePhone, isMobilePhoneLocals } = require("validator");

const usersSchema = Schema({
	userName: {
		type: String,
		required: [true, "Name field is required"],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Password field is required"],
	},
	contact: {
		address: {
			type: String,
			required: [true, "Address field is required"],
		},
		mobile: {
			type: String,
			required: [true, "Mobile field is required"],
			validate: {
				validator: (mobileNumber) =>
					isMobilePhone(mobileNumber, isMobilePhoneLocals, {
						strictMode: true,
					}),
				message:
					"Please enter a correct mobile number along with the country code",
			},
		},
		email: {
			type: String,
			required: [true, "Email field is required"],
			validate: {
				validator: (email) => isEmail(email),
				message: "Please enter a correct email",
			},
		},
	},
	wishlist: {
		type: Schema.Types.ObjectId,
		ref: "wishlists",
	},
	cart: {
		type: Schema.Types.ObjectId,
		ref: "carts",
	},
});

const users = model("users", usersSchema);

module.exports = users;
