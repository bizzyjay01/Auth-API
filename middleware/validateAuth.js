
const jwt = require("jsonwebtoken");
const Users = require("../model/authModel");

// To know a user from a particular token

// const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
// Verifies the token using the jwt.verify method from the jsonwebtoken package.
// It uses the token from the request and the secret key process.env.ACCESS_TOKEN (typically stored in environment variables for security).
// If the token is valid, it decodes it and stores the decoded payload in the variable decoded.
// If the token is invalid or expired, an error will be thrown, and the catch block will handle


const validateToken = async (req, res, next) => {
	try {
		const tk = req.header("Authorization"); // SAVE whatever is in authorization or in headers in postman, inside tk variable

		const tkk = tk.split(" ");
		const token = tkk[1];

		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

		if (!decoded) {
			return res.status(401).json({ message: "Invalid login details" });
		}
        console.log({decoded})

		const user = await Users.findOne({ _id: decoded.user._id });

		if (!user) {
			return res.status(401).json({ message: "User account not found" });
		}

		req.user = user;
        // console.log(user);

		next();

		
	} catch (error) {
		
	}
};

module.exports = validateToken;
