const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/request");
const userRouter = require("./router/user");

// read JSON and convert JSON into JS object and add in req.body
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
    .then(async () => {
        console.log('Database connected successfully !!');
        await User.createIndexes();
        app.listen(7777, () => {
            console.log('Server is running on port 7777...');
        });
    })
    .catch(error => console.error('Database is not connected', error));

