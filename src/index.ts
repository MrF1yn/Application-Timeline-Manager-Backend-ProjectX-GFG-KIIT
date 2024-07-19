

import express, {Express, NextFunction, Request, Response} from "express";
import {createServer} from "node:http";
import dotenv from "dotenv";
import {PrismaClient} from '@prisma/client'
import userRouter from "./users/users";
import cors from "cors";


import {Db, Document, MongoClient, ServerApiVersion} from 'mongodb';
import {randomUUID} from "node:crypto";


const uri = "mongodb+srv://mrflyn6000:wlMS2pJFUH0Lckau@cluster0.iyp4pok.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const mongoClient = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export let mongoDb: Db;

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await mongoClient.connect();
        // Send a ping to confirm a successful connection
        await mongoClient.db("rtct").command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        mongoDb = mongoClient.db("rtct");
    } catch (e) {
        console.error(e);
    }
}

run().catch(console.dir);


dotenv.config();

const app: Express = express();
// setupKinde(config, app);
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


function populateMessagePacket(user: any, msg: string) {
    return {
        id: randomUUID().toString(),
        senderID: user.id,
        senderName: user.first_name + " " + user.last_name,
        timestamp: new Date().getTime(),
        content: {
            msgType: "text",
            text: msg
        }
    }
}


app.use(cors({
    origin: "*",
    credentials: true,            //access-control-allow-credentials:true
}));

app.use(express.json({
    limit: "5mb"
}));

app.use("/users", userRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});


server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

