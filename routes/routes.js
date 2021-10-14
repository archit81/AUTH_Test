const router = require("express").Router();
const user = require("../models/userModel");


// An endpoint for a new user signing up
router.post("/sign_up", async (req, res) => {
	const { name, email, password } = req.body;

	// checks if name is non-empty
	if (!name) 
        return res.status(400).json({ success: false });

	// check if email matches the requirements
	const emailRegexp =
		/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	if (!email || !emailRegexp.test(email)) 
        return res.status(400).json({ success: false });

	// check if password matches the requirements
	const passwordRegexp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/i;
	if (password.length < 8 || password.includes(email.substring(0, email.lastIndexOf("@"))) || !passwordRegexp.test(password)) 
        return res.status(400).json({ success: false });

	// check if user with same email already exists
	const existingUser = await user.findOne({ email: email });
	if (existingUser) return res.status(400).json({ success: false });

	// create a new user and save
	const newUser = new user({
		name,
		email,
		password,
	});
	newUser.save();

	// successful sign up
	return res.status(201).json({ success: true });
});


// An endpoint for an existing user to sign in
router.post("/sign_in", async (req, res) => {
	try {
		const { email, password } = req.body;

		// checks if users with given email exists or not
		const existingUser = await user.findOne({ email: email });
		if (!existingUser) return res.status(400).json({ success: false });

		// checks if user credentials matches
		if (existingUser.password != password) return res.status(400).json({ success: false });

		// successful sign in
		return res.status(200).json({ success: true });
	} catch (err) {
		console.log(err);
		return res.status(400).json({ success: false });
	}
});


// Endpoint to delete all existing users in the system
router.post("/clean", async (_, res) => {
    // deletes all users from database
    await user.deleteMany({});

	return res.status(200).json({ success: true });
});

module.exports = router;
