import  Router  from "express"
import { logger } from "../Middleware";
import { Request } from "express";


export const router = Router();

router.get("/", logger, (req:Request, res) => {
    res.send({
        status: "ok",
        message: "Hello World",
        time : req.timestamp
    });
});

router.get('/error', (req, res) => {
    throw new Error("application error");
});

router.post('/', (req:Request, res) => {
    res.send({
        message: "POST method",
        time: req.timestamp,
        data: req.body
    });
});