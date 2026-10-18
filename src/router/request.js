const express = require("express");
const requestRouter = express.Router();
const { isUserAuthenticate } = require("../middleware/auth");
const ConnectionRequest = require("../models/requests");
const User = require("../models/user");
const { ALLOWED_SEND_STATUS, ALLOWED_REVIEW_STATUS } = require("../utils/constants");
const { responseHandler } = require("../utils/handler");

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
        const loggedInUserId = `${req?.user?.firstName}`;
        await requestData.save();
        return responseHandler(
            res, 
            200, 
            'success', 
            `${loggedInUserId} has ${status} ${status === 'interested' ? 'in' : 'to'} ${isValidToUserId?.firstName}`,
            SavedData
        );

    } catch (error) {
        return responseHandler(res, 400, 'error', error.message);
    }

});

requestRouter.post("/request/review/:status/:requestId", isUserAuthenticate, async(req, res) => {
    // status should be valid
    // kunal send request ram, ram has reviewed, ram has either accepted|rejected the request
    // logged in user should ram i.e. toUserId
    // send status should be interested, then only ram can received the request
    const { status, requestId } = req?.params;
    if(!ALLOWED_REVIEW_STATUS.includes(status)) {
        return res.status(400).send('Status not allowed!');
    }
    const requesedtData = await ConnectionRequest.findOne({
        _id : requestId,
        toUserId: req?.user?._id,
        status: "interested"
    }).populate("toUserId", "firstName lastName")
    .populate("fromUserId", "firstName");
    if(!requesedtData) {
        return res.status(404).send("Not Found!");
    }
    
    requesedtData.status = status;
    const data = await requesedtData.save();
    res.json({
        message: `${requesedtData?.fromUserId?.firstName} requested ${status} By  ${req?.user?.firstName}  ${req?.user?.lastName}`, 
        data
    });

});

module.exports = requestRouter;
