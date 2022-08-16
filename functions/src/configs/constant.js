exports.responseSuccess = (res, message) => {
    return res.status(200).json({
        message,
    })
}

exports.responseErrorFromServer = (res, message) => {
    return res.status(500).json({
        message
    })
}

exports.responseDataSuccess = (res, data, message = "success") => {
    return res.status(200).json({
        message,
        data
    })
}

exports.responseErrorFromClient = (res, value = "undefined") => {
    return res.status(400).json({
        message: `invalid value ${value}`
    })
}  