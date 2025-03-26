import { Router, Request, Response, NextFunction } from "express";
import { db } from "../../config/database";
import { getUsers } from "../../controller/UserController";

export const router = Router();

router.get("/", getUsers);