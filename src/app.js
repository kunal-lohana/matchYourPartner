const express = require("express");
const app = express();

const { userAuth }  = require("./middleware/auth");

class apiError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status;
    }
}

app.get("/admin", (req, res) => {
    throw new apiError(400, 'client Error')
})
app.get('/user/getAllData', userAuth, (err, req, res, next) => {
    res.send(`Get AllData user error: ${err}`);
});

app.get('/user/delete', (req, res, next) => {
    next("/delete not exist")
    res.send("Delete User Data");
})

// global handling all types of error here...
app.use('/', (req, res, next) => {
    console.log('Matches routes -> but it is Request handler');
        res.status(401).send(` not found1`);
})

// global handling all types of error here...
app.use('/', (err, req, res, next) => {
    console.log('Error handler -> run only when error occured');
    if(err) {
        res.status(500).send(err ? `Hey ${err}` : "Something went wrong!!");
    } else {
        res.status(401).send(`${req.param}  error found1`);
    }
})

app.listen(7777, () => {
    console.log('Server is running on port 7777...');
});