const express = require("express");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const { validateSignUpData, validateLoginData } = require("../utils/validator");
const User = require("../models/user");

// Add SignUp data in DB
authRouter.post("/signup", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        // validate fields
        await validateSignUpData(req.body);
        // bcrypt the password
        const hashPassword = await bcrypt.hash(password, 10);

        // create a new instance of User Model
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashPassword
        });
        console.log('/signup user data:', user);
        await user.save();
        res.send("Data saved successfully!!");
    } catch (error) {
        res.status(400).send("Error :" + error.message);
    }
})

// login user
authRouter.post("/login", async (req, res) => {
    const { email = "", password = "" } = req.body || {};
    try {
        await validateLoginData(req.body);
        const user = await User.findOne({ email: email }); // return null or object
        if (!user) {
            res.status(400).send('Invalid Credentials!!');
        } else {
            const isPasswordValid = await user.validatePassword(password);
            if (!isPasswordValid) {
                res.status(400).send('Invalid Credentials!!');
            } else {
                // create jsonwebtoken
                const token = await user.getJWT();
                console.log('token', token);
                // Add token in cookie
                res.cookie("token", token, {
                    maxAge: 15 * 60 * 1000,
                    httpOnly: true,
                    secure: true
                });

                res.send("Login successfully!!");
            }
        }
    } catch (error) {
        res.status(400).send("Error :" + error.message);
    }
})

authRouter.post("/logout", (req, res) => {
     res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    res.json({
        message: "Logout Successfully"
    });
})

module.exports = authRouter;