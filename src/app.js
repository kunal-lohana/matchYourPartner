const express = require("express");

const app = express();

// GET call for user
app.get("/user/:userId", (req, res) => {
    const { userId } = req.query;
    console.log(req.params);
    console.log(req.query);
    // res.write(req.params);
    res.json({
        query: req.query,
        params: req.params
    })
});

app.listen(7777, () => {
    console.log('Server is running on port 7777...');
})

// http://localhost:7777/user/23?firstname=kunal&lastname=lohana
// {
//     "query": {
//         "firstname": "kunal",
//         "lastname": "lohana"
//     },
//     "params": {
//         "userId": "23"
//     }
// }