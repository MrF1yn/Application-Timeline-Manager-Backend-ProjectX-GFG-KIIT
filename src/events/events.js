import express from "express";
import {hackerRankScraper, hackerEarthScraper, prisma, devpostScraper} from "~/index";
import axios from "axios";
import * as cheerio from 'cheerio';

const eventsRouter = express.Router();

eventsRouter.get("/scrape/:link", async (req, res) => {
    try {
        const { link } = req.params;
        console.log(`Scraping data for link: ${link}`);
        let data;
        const splitLink = link.replaceAll("https://", "").split(".");
        switch (splitLink.length < 3 ? splitLink[0]: splitLink[1]){
            case "hackerrank":
                data = await hackerRankScraper.scrapeEventPage(link);
                break;
            case "hackerearth":
                data = await hackerEarthScraper.scrapeEventPage(link);
                break;
            case "devpost":
                data = await devpostScraper.scrapeEventPage(link);
                break;
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('Error occurred while scraping:', error);
        res.status(500).send('An error occurred while scraping the data.');
    }
});

export default eventsRouter;
