const express = require("express");
const userRouter = express.Router();
const { isUserAuthenticate } = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/requests");
const USER_SAFE_DATA = "firstName lastName age gender about skills photoUrl";

// get All user data
// - not include himself details
// - not include whom you send request either interested/ignored
// - not include whom you accepted/rejected request
userRouter.get("/user/feed", isUserAuthenticate, async (req, res) => {
    try {
        const loggedInUserId = req?.user?._id;
        let limit = parseInt(req?.query?.limit) || 10;
        const page = parseInt(req?.query?.page) || 1;
        limit > 50 ? 50 : limit;
        const skipRecord = (page-1)*limit;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId },
                { toUserId: loggedInUserId }]
        }).select("fromUserId toUserId");
        // fetch all Ids that exisits in connnectionRequests connected to loggedInUser
        const hideConnectionIds = new Set();
        connectionRequests.forEach(data => {
            hideConnectionIds.add(data?.fromUserId.toString());
            hideConnectionIds.add(data?.toUserId.toString());
        })
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideConnectionIds) } },
                { _id: { $ne: loggedInUserId } }
            ]
        }).select(USER_SAFE_DATA)
        .skip(skipRecord)
        .limit(limit);
        const total = await User.countDocuments();
        res.json({
            'message': `All available Connections`,
            total,
            data: users
        });

    } catch (error) {
        res.status(400).send("Error :" + error.message);
    }
})

userRouter.get("/users", isUserAuthenticate, async (req, res) => {
    const cursor = req?.query?.cursor ? new Date(req?.query?.cursor) : new Date();
    const limit = Math.min(parseInt(req?.query?.limit) || 20, 50);
    const items = await User.find({
        createdAt : { $lte: cursor}
    }).limit(limit).sort({ createdAt : -1 })
    const nextCursor = items.length === limit ? items[items.length-1].createdAt : null;
    res.json({
        data: [...items, nextCursor]
    })
});

// get all pending requests to logged_in user
userRouter.get("/user/receivers", isUserAuthenticate, async (req, res) => {
    try {
        const requestData = await ConnectionRequest.find({
            toUserId: req?.user?._id,
            status: 'interested'
        }).populate("fromUserId", USER_SAFE_DATA);
        if (!requestData) {
            return res.status(404).send("No connection requests exists!");
        }
        res.json({
            'message': `${req?.user?.firstName} has received interested request`,
            data: requestData
        })
    } catch (error) {
        res.status(400).send("Error :" + error.message);
    }
});

// which user will part of my connections- that's connected with me
// those whom i send requests and it's accepted 
// those users who requests I received and I  accepted it
userRouter.get("/user/connections", isUserAuthenticate, async (req, res) => {
    try {
        const loggedInUserId = req?.user?._id;
        // get connection list for loggedIn user
        const requestList = await ConnectionRequest.find({
            status: "accepted",
            $or: [
                { fromUserId: loggedInUserId, },
                { toUserId: loggedInUserId, }
            ]
        }).populate("toUserId", USER_SAFE_DATA)
            .populate("fromUserId", USER_SAFE_DATA);

        if (!requestList) {
            throw new Error("No connection request exists!");
        }
        const data = requestList.map(request => {
            if (loggedInUserId.toString() === request?.fromUserId?._id.toString()) {
                return request?.toUserId;
            }
            return request?.fromUserId;
        })

        res.status(200).json({
            status: 'success',
            message: 'Connections Details',
            data: data
        })
    } catch (error) {
        res.status(400).send("Error: " + error.message)
    }
})

module.exports = userRouter;