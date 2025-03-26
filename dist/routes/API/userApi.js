"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const UserController_1 = require("../../controller/UserController");
exports.router = (0, express_1.Router)();
exports.router.get("/", UserController_1.getUsers);
