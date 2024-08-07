

import express, {Express, NextFunction, Request, Response} from "express";
import {createServer} from "node:http";
import dotenv from "dotenv";
import {PrismaClient} from '@prisma/client'
import cors from "cors";
import {randomUUID} from "node:crypto";
import eventsRouter from "./events/events";







dotenv.config();

const app: Express = express();
const server = createServer(app);
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();
export {prisma};

export async function verifierMiddleware(req: any, res: any, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1] || "";
        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const result = await fetch('https://mrflyn6000.kinde.com/oauth2/user_profile',
            {
                method: 'GET',

                headers: headers
            });
        console.log(result);

        // const payload = await verifier.verify(token);
        if (result.status === 200) {
            req.user = await result.json();
            next();
            return;
        }
        res.send("Invalid token").status(401);
        return;
    } catch (err) {
        console.log(err);
        res.send("Invalid token ERROR").status(401);
        return;
    }
}



app.use(cors({
    origin: "*",
    credentials: true,            //access-control-allow-credentials:true
}));

app.use(express.json({
    limit: "5mb"
}));

app.use("/users", eventsRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});


server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

