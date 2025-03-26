"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const Middleware_1 = require("../Middleware");
exports.router = (0, express_1.default)();
exports.router.get("/", Middleware_1.logger, (req, res) => {
    res.send({
        status: "ok",
        message: "Hello World",
        time: req.timestamp
    });
});
exports.router.get('/error', (req, res) => {
    throw new Error("application error");
});
exports.router.post('/', (req, res) => {
    res.send({
        message: "POST method",
        time: req.timestamp,
        data: req.body
    });
});
