const express = require("express");

const app = express();

// add try catch to handle particular route error
app.get('/user/login', (req, res) => {
    try {
        throw new Error("Something wrong in user login");
        res.send("User login successfully");
    } catch(error) {
        res.status(500).send("Something wrong in user login");
    }
});

app.get('/user/getAllData', (req, res) => {
    throw new Error("axy adfdfd");
    res.send("Fetch User Data");
});

app.get('/user/Delete', (req, res) => {
    res.send("Delete User Data");
})

// global handling all types of error here...
app.use("/", (err, req, res, next) => {
    if(err) {
        res.status(500).send("Something went wrong!!");
    }
})

app.listen(7777, () => {
    console.log('Server is running on port 7777...');
});