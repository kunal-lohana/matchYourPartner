const express = require("express");
const requestRouter = express.Router();
const { isUserAuthenticate } = require("../middleware/auth");
const ConnectionRequest = require("../models/requests");
const User = require("../models/user");
const { ALLOWED_SEND_STATUS } = require("../utils/constants");
const { responseHandler } = require("../utils/handler");

//sendConnectionRequest
requestRouter.get("/sendConnectionRequest", isUserAuthenticate, (req, res) => {
    const userData = req?.user || {};
    res.send(userData.firstName + " send the connection request");
});

requestRouter.post("/request/send/:status/:userId", isUserAuthenticate, async (req, res) => {
    try {
        const status = req?.params?.status;
        const toUserId = req?.params?.userId;
        const fromUserId = req?.user?._id;
        const isValidStatus = ALLOWED_SEND_STATUS.includes(status);
        if (!isValidStatus) {
            throw new Error("Invalid status!");
        }
        const isValidToUserId = await User.findById(toUserId);
        if (!isValidToUserId) {
            throw new Error("Invalid Requested User!");
        }
        const existingConnectionRequst = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingConnectionRequst) {
            throw new Error("Connection Request already exists!");
        }
        const SavedData = {
            fromUserId,
            toUserId,
            status
        };
        const requestData = new ConnectionRequest(SavedData);
        await requestData.save();
        return responseHandler(res, 200, 'success', 'Connection request send successfully', SavedData);

    } catch (error) {
        return responseHandler(res, 400, 'error', error.message);
    }

});

module.exports = requestRouter;
