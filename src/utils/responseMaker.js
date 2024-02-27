module.exports.makeResponse = (res, statusCode, success, message, data = null) => {
    res.status(statusCode).json({
        success: success,
        message: message,
        data: data
    });
};

