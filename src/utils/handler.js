
const responseHandler = (res, statusCode, status, message, data = null) => {
    res.status(status).json({
        status: status,
        message: message,
        data
    })
}
module.exports = { responseHandler };
