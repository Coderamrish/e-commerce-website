const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
    try {
        let { email, password, fullname } = req.body;

        // Check if user already exists
        let user = await userModel.findOne({ email: email });
        if (user) {
            return res.status(401).send("You already have an account, please log in.");
        }

        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        let newUser = await userModel.create({
            email,
            password: hashedPassword,
            fullname,
        });

        // Generate a token for the new user
        let token = generateToken(newUser);

        // Set the token in a cookie
        res.cookie("token", token);

        // Send success response
        res.send("User created successfully");

    } catch (err) {
        // Send error response
        res.status(500).send({ error: err.message });
    }
};

module.exports.loginUser = async function (req, res) {
    try {
        const { email, password } = req.body;

        // Find the user by email
        let user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(401).send("Email or password incorrect");
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Email or password incorrect");
        }

        // Generate a token for the logged-in user
        let token = generateToken(user);

        // Set the token in a cookie
        res.cookie("token", token);

        // Send success response
        res.send("User logged in successfully");

    } catch (err) {
        // Handle any errors
        res.status(500).send({ error: err.message });
    }
};

module.exports.logout = function (req, res) {
    res.cookie("token", "");
    res.redirect("/");
};