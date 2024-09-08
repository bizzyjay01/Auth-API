const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./db");
const Users = require("./model/authModel");
const bcrypt = require("bcrypt"); // for hashing of password or secret information
const {
	validateRegistration,
	validateLogin,
} = require("./middleware/validation");
const validateToken = require("./middleware/validateAuth")
const sendUserEmail = require("./sendEmail")

const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 8000;

connectDB();

const app = express();
app.use(express.json());

app.listen(PORT, () => {
	console.log(`Server has started running... ${PORT}`);
});

app.get("/", (req, res) => {
	return res.status(200).json({ message: "Welcome to Youthrive Server" });
});

// Authentication
//validateRegistration middleware
app.post("/register", validateRegistration, async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	const existingUser = await Users.findOne({ email });

	if (existingUser) {
		return res.status(400).json({ message: "User Account Already exist!" });
	}

	// Hash password
	const hashedPassword = await bcrypt.hash(password, 12); //12- number of times to be hashed

	// Generate ID Name/date/number
	const number = Math.floor(Math.random() * 100);
	const theId = `${lastName}/${new Date()}/${number}`;

	const newUser = new Users({
		firstName,
		lastName,
		email,
		password: hashedPassword,
	});

	await newUser.save();
	await sendUserEmail(email)

	// Send Users Email after registration

	return res.status(200).json({
		message: "Successful",
		user: newUser,
	});
});

app.get("/user/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const user = await Users.findById(id);

		return res.status(200).json({ message: "Successful", user });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}

	//try catch is an error handling method
});

app.post("/login", validateLogin, async (req, res) => {
	try {
		// if(!req.user) {
		// 	return res.status(401).json({message:"Access Denied, Invalid"})
		// }
		const { email, password } = req.body;

		const user = await Users.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User account not found" });
		}

		// password is the one on the database, while user.password is the one sent by the user on the request during login. so to check if both match

		const isMatched = bcrypt.compare(password, user.password);

		if (!isMatched) {
			return res.status(400).json({ message: "Incorrect password or email!" });
		}

		//Generating Tokens - the backend and frontend needs to see the token before performing any operation. The backend must see the token in the payload (i.e the request). so as you are sending the request, include the token. if the frontend sees it, it redirects the user to the dashboard.

		//Summarily, access token is used To authenticate API requests on behalf of a user

		// Access Token
		const accessToken = jwt.sign({ user }, `${process.env.ACCESS_TOKEN}`, {expiresIn: "30m",});
		const refreshToken = jwt.sign({ user }, `${process.env.REFRESH_TOKEN}`, {expiresIn: "30m"});

		return res.status(200).json({
			message: "Login Successful",
			accessToken,
			user,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

app.get("/users", async (req,res)=>{
	const allUsers = await Users.find()

	return res.status(200).json({message:"Successful", count:allUsers.length, allUsers})
})

// Protected Routes
app.post("/auth", validateToken, async(req,res)=>{

	return res.status(200).json({message:"Successful", user:req.user})

})
