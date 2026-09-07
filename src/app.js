const express = require("express");

const app = express();

app.use("/hello", (req, res) => {
    res.end("/hello api is running on 7777");
});

app.use("/test", (req, res) => {
    res.end("/test api is running...");
})


app.listen(7777, () => {
    console.log('Server is running on port 7777...');
})