const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const app = express();
const { validateSignUpData, validateLoginData } = require("./utils/validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { isUserAuthenticate } = require("./middleware/auth");

// read JSON and convert JSON into JS object and add in req.body
app.use(express.json());
app.use(cookieParser());

// get All user data
app.get("/feed", async (req, res) => {
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
app.get("/user/:id", async (req, res, next) => {
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
app.get("/user", async (req, res) => {
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

// Add SignUp data in DB
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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

//fetch profile
app.get("/profile", isUserAuthenticate, (req, res) => {
    try {
        const userData = req?.user;
        res.send('logeed-in User: ' + userData.firstName);
    } catch (error) {
        res.status(400).send("Error :" + error.message);
    }
});

//sendConnectionRequest
app.get("/sendConnectionRequest", isUserAuthenticate, (req, res) => {
    const userData = req?.user || {};
    res.send(userData.firstName + " send the connection request");
});


// update partial data of user
app.patch("/user/:userId", async (req, res) => {
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
app.delete("/user", async (req, res) => {
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
})

connectDB()
    .then(async () => {
        console.log('Database connected successfully !!');
        await User.createIndexes();
        app.listen(7777, () => {
            console.log('Server is running on port 7777...');
        });
    })
    .catch(error => console.error('Database is not connected', error));

