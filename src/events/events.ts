import express, {NextFunction} from "express";
import {prisma} from "../index";


const eventsRouter = express.Router();


eventsRouter.get("/scrape/:link", async (req: any, res) => {
    const {link} = req.params;
    console.log(link);

    res.status(200).send(link);
});


export default eventsRouter;