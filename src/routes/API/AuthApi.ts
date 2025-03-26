import { Router } from "express";
import { AuthController } from "../../controller/AuthController";
import { AuthMiddleware } from "../../Middleware/AuthMiddleware";
const router = Router();
const authController = new AuthController();
// Define authentication routes
router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/refresh-token", authController.refreshToken.bind(authController));
router.post("/logout", AuthMiddleware.authenticate, authController.logout.bind(authController)); 

export { router as AuthRoutes };