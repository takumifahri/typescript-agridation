"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = logger;
// Middleware
function logger(req, res, next) {
    console.log(`${req.timestamp} ${req.method} ${req.ip}${req.originalUrl}`);
    next(); // untuk seperti return pada middleware route
}
