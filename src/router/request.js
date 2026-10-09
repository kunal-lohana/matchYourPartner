const express = require("express");
const requestRouter = express.Router();
const { isUserAuthenticate } = require("../middleware/auth");

//sendConnectionRequest
requestRouter.get("/sendConnectionRequest", isUserAuthenticate, (req, res) => {
    const userData = req?.user || {};
    res.send(userData.firstName + " send the connection request");
});

module.exports = requestRouter;
