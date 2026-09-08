const express = require("express");

const app = express();

// GET call for user
app.get("/user", (req, res) => {
    res.end("Fetch User data successfully !");
})


// POST call for user
app.get("/user", (req, res) => {
    res.end("Fetch User data successfully !");
})

// POST call for user
app.post("/user", (req, res) => {
    const data = { firstname: 'kunal', lastname: 'lohana'};
    console.log(data);
    res.send(data);
})

// PUT call for user
app.put("/user", (req, res) => {
    res.end("Update User data successfully !");
})

// PATCH call for user
app.patch("/user", (req, res) => {
    res.end("Update partially User data successfully !");
})

// DELETE call for user
app.delete("/user", (req, res) => {
    res.end("Delete User data successfully !");
})


app.listen(7777, () => {
    console.log('Server is running on port 7777...');
})