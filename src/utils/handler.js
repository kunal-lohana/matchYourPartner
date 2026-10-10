
const responseHandler = (res, statusCode, status, message, data = null) => {
    res.status(statusCode).json({
        status: status,
        message: message,
        data
    })
}
module.exports = { responseHandler };
