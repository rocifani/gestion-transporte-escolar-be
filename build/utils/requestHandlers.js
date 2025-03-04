"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data) {
    res.status(200).json({
        success: true,
        data: data,
        error: null
    });
}
function sendError(res, message = "Internal Server Error", statusCode = 500) {
    res.status(statusCode).json({
        success: false,
        data: null,
        error: {
            message: message
        }
    });
}
