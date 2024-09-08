const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
	{
        userID:{type:String},
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
	},

	{
		timestamps: true,
	}
);

const Users = new mongoose.model("Users", authSchema);

module.exports = Users;
