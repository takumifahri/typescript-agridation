"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandle = errorHandle;
function errorHandle(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.message);
}
