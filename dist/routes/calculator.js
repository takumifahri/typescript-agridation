"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const express_1 = __importDefault(require("express"));
exports.route = (0, express_1.default)();
exports.route.get('/', (req, res) => {
    res.send({
        message: "Here the data",
        data: {
            name: "Rahul",
            age: 20,
        }
    });
});
exports.route.get('/add/:num1/:num2', (req, res) => {
    const num1 = parseInt(req.params.num1);
    const num2 = parseInt(req.params.num2);
    res.send({
        result: num1 + num2
    });
});
