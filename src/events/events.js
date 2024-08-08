import express, {NextFunction} from "express";
import {hackerRankScraper, prisma} from "~/index";
import axios from "axios";
import * as cheerio from 'cheerio';

const eventsRouter = express.Router();


eventsRouter.get("/scrape/:link", async (req, res) => {
    const {link} = req.params;
    console.log(link);
    const scrapedData = await hackerRankScraper.scrapeEventPage(link);
    console.log(scrapedData);
    res.status(200).send(scrapedData);
});


export default eventsRouter;