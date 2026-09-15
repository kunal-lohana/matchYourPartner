const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const app = express();

// read JSON and convert JSON into JS object and add in req.body
app.use(express.json());

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
    if(!userId) next()
    else {
        try {
            // const userDetails = await User.findOne({ _id : userId});
            const userDetails = await User.findById(userId);
            console.log('raise quey for db', userDetails);
            if(!userDetails) {
                res.status(400).send('UserId not exists!');
            } else {
                res.send(userDetails);
            }
        } catch(error) {
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

//delete user by id
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        if(!user) {
            res.status(401).send('User not exist')
        } else {
            res.send("User deleted successfully!!");
        }
    } catch(error) {
        res.status(404).send('user not allowed!!');
    }
})

// update partial data of user
app.patch("/user", async(req, res) => {
    const userData = req.body;
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndUpdate(userId, userData, { returnDocument: 'before'});
        console.log('user before update', user);
        if(!user) {
            res.status(404).send('User not exists');
        } else {
            res.send('User updated successfully');
        }
    } catch(error) {
        res.status(500).send("Something went wrong!!");
    }
})

app.post("/signup", async (req, res) => {
    console.log(req.body);
    // create a new instance of User Model
    const user = new User(req.body);
    try {
        await user.save();
        res.send("Data saved successfully!!");
    } catch (error) {
        res.status(400).send("Error occured while saving user data" + error.message);
    }
})

connectDB()
    .then(() => {
        console.log('Database connected successfully !!');
        app.listen(7777, () => {
            console.log('Server is running on port 7777...');
        });
    })
    .catch(error => console.error('Database is not connected'));

