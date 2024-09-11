const validateRegistration = async (req, res, next) => {
	const { firstName, lastName, email, password } = req.body;
	const errors = [];

	if (!email) {
		errors.push("Please add email");
	}

	if (password.length < 8) {
		errors.push("Minimum of eight chadracters required for password.");
	}

	// so if the error array is not empty
	if (errors.length > 0) {
		return res.status(400).json({ message: errors });
	}

	next(); // i.e to continue. so the request on postman won't just be loading
};

// Validate Login
const validateLogin = async (req, res, next) => {
	const { email, password } = req.body;
	const errors = [];

	if (!email) {
		errors.push("Please add your email");
	} else if (!validEmail(email)) {
		errors.push("email format is incorrect");
	}

	if (!password) {
		errors.push("please add password");
	}

	if (errors.length > 0) {
		return res.status(400).json({ message: errors });
	}

    next()
};



// validate email with regex
const validEmail = (email) => {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
};

module.exports = {
    validateRegistration, validateLogin, 
    validEmail
};
