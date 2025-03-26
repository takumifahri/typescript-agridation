"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const AuthController_1 = require("../../controller/AuthController");
const AuthMiddleware_1 = require("../../Middleware/AuthMiddleware");
const router = (0, express_1.Router)();
exports.AuthRoutes = router;
const authController = new AuthController_1.AuthController();
// Define authentication routes
router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/refresh-token", authController.refreshToken.bind(authController));
router.post("/logout", AuthMiddleware_1.AuthMiddleware.authenticate, authController.logout.bind(authController));
