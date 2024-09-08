const mongoose = require("mongoose");

const connectDB = async () => {
	mongoose
		.connect(`${process.env.MONGODB_URL}`)
		.then(() => console.log("my MongoDB database is connected"));
};

module.exports = connectDB

