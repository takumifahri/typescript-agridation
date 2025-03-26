"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.time = time;
function time(req, res, next) {
    // console.log(`Time: ${new Date().toLocaleString()}`);
    req.timestamp = Date.now();
    next();
}
