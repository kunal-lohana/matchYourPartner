const express = require("express");
const userRouter = express.Router();
const { isUserAuthenticate } = require("../middleware/auth");
const User = require("../models/user");

// get All user data
userRouter.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send("users not found");
        } else {
            console.log('users', users);
            res.send(users);
        }
    } catch (error) {
        res.status(404).send("Something went wrong!!");
    }
})

// find user by id
userRouter.get("/user/:id", async (req, res, next) => {
    const userId = req.params.id;
    console.log('userId', userId);
    if (!userId) next()
    else {
        try {
            // const userDetails = await User.findOne({ _id : userId});
            const userDetails = await User.findById(userId);
            console.log('raise quey for db', userDetails);
            if (!userDetails) {
                res.status(400).send('UserId not exists!');
            } else {
                res.send(userDetails);
            }
        } catch (error) {
            res.status(500).send('Something went wrong!!');
        }
    }


})

// find user by firstName
userRouter.get("/user", async (req, res) => {
    const userFirstName = req.body.firstName;
    console.log('userFirstName', userFirstName);
    try {
        const users = await User.findOne({ firstName: userFirstName });
        if (users.length === 0) {
            res.status(404).send("user not found");
        } else {
            console.log('users', users);
            res.send(users);
        }
    } catch (error) {
        res.status(404).send("Something went wrong!!");
    }

})


// update partial data of user
userRouter.patch("/user/:userId", async (req, res) => {
    const userData = req.body;
    const userId = req.params?.userId;
    const ALLOWED_UPDATES = ["photoUrl", "about", "skills"];
    try {
        const isAllowedUpdates = Object.keys(userData).every((userKey) =>
            ALLOWED_UPDATES.includes(userKey)
        );
        if (!isAllowedUpdates) {
            throw new Error('Update not allowed!!');
        }
        const user = await User.findByIdAndUpdate(userId, userData, {
            returnDocument: 'before',
            runValidators: true
        });
        console.log('user before update', user);
        if (!user) {
            res.status(404).send('User not exists');
        } else {
            res.send('User updated successfully');
        }
    } catch (error) {
        res.status(500).send("Update Failed!! :" + error);
    }
})

//delete user by id
userRouter.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            res.status(401).send('User not exist')
        } else {
            res.send("User deleted successfully!!");
        }
    } catch (error) {
        res.status(404).send('user not allowed!!');
    }
});

module.exports = userRouter;