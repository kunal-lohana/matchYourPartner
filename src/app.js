const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middleware/auth");

app.use("/admin", adminAuth);
// app.use("/user", userAuth);

app.get('/admin/getAllData', (req, res) => {
    res.send("Fetch Admin Data");
});

app.get('/admin/Delete', (req, res) => {
    res.send("Delete Admin Data");
})

app.get('/user/login', (req, res) => {
    res.send("User login successfully");
});

app.get('/user/getAllData', userAuth, (req, res) => {
    res.send("Fetch User Data");
});

app.get('/user/Delete', userAuth, (req, res) => {
    res.send("Delete User Data");
})

app.listen(7777, () => {
    console.log('Server is running on port 7777...');
});