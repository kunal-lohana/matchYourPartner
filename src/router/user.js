const express = require("express");
const userRouter = express.Router();
const { isUserAuthenticate } = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/requests");

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

userRouter.get("/user/connections", isUserAuthenticate, async (req, res) => {
    try {
        const fromUserId = req?.user?._id;
        // get connection list for this user
        const requestList = await ConnectionRequest.find({ fromUserId });
        if (!requestList) {
            throw new Error("No connection request exists!");
        }
        console.log('requestList', requestList);
        const toUserIdList = [...new Set(requestList?.map(({ toUserId }) => toUserId.toString()))];
        // fetch user's data of connection request
        // const requestedUsersData = await Promise.all(
        //     toUserIdList.map(id => User.findById(id).exec())
        // );
        const requestedUsersData = await User.find({
            _id: {
                $in: toUserIdList
            }
        })
        res.status(200).json({
            status: 'success',
            message: 'Connections Details',
            data: requestedUsersData
        })
    } catch (error) {
        res.status(400).send("Error: " + error.message)
    }
})

module.exports = userRouter;