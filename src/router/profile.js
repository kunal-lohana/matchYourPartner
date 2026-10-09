const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { isUserAuthenticate } = require("../middleware/auth");
const { responseHandler } = require("../utils/handler");
const crypto = require("crypto");

//fetch profile
profileRouter.get("/profile/view", isUserAuthenticate, (req, res) => {
    try {
        const userData = req?.user;
        return responseHandler(
            res,
            200,
            'success',
            'User details',
            userData
        )
    } catch (error) {
        return responseHandler(
            res,
            400,
            'error',
            error.message
        );
    }
});

profileRouter.patch("/profile/edit", isUserAuthenticate, async (req, res) => {
    try {
        const allowedList = ['firstName', 'lastName', 'age', 'gender', 'photoUrl', 'about', 'skills'];
        const isValidRequest = Object.keys(req.body).every(k => allowedList.includes(k));
        if (!isValidRequest) {
            throw new Error('Invalid Request!!');
        }
        const userData = req?.user;
        Object.keys(req.body).forEach(k => userData[k] = req.body[k]);
        await userData.save();
        return responseHandler(
            res,
            200,
            'success',
            'Edit profile successfully'
        )
    } catch (error) {
        return responseHandler(
            res,
            400,
            'error',
            error.message
        )
    }

});

profileRouter.patch("/profile/password", async (req, res) => {
    try {
        const { email } = req.body?.email;
        if (!email) {
            throw new Error("Invalid credentials");
        }
        else {
            const isEmailValid = User.findOne(email);
            if (!isEmailValid) {
                throw new Error("If an account exists for this email, a password reset link has been sent.");
            } else {
                // match email in db
                // now create random token and expiry
                // set in db - resetToken and resetExpiry
                const randomToken = await crypto.randomBytes(32).toString("hex");
                user.resetToken = randomToken;
                user.resetExpiry = Date.now() + 15 * 60 * 1000;
                await user.save();

                // create reset link now and send to client
                const resetLink = `http://localhost:3000\reset-password?token=${randomToken}`;
                res.send(resetLink);
            }
        }
    } catch (error) {
        res.status(400).send("Error :" + error.message);
    }

});

module.exports = profileRouter;