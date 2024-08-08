import express from "express";
import { hackerRankScraper, hackerEarthScraper, prisma } from "~/index";
import axios from "axios";
import * as cheerio from 'cheerio';

const eventsRouter = express.Router();

eventsRouter.get("/scrape/:link", async (req, res) => {
    try {
        const { link } = req.params;
        console.log(`Scraping data for link: ${link}`);
        
        const hackerRankData = await hackerRankScraper.scrapeEventPage(link);
        const hackerEarthData = await hackerEarthScraper.scrapeEventPage(link);

        console.log('HackerRank Data:', hackerRankData);
        console.log('HackerEarth Data:', hackerEarthData);
        
        const combinedData = {
            hackerRank: hackerRankData,
            hackerEarth: hackerEarthData
        };

        res.status(200).json(combinedData);
    } catch (error) {
        console.error('Error occurred while scraping:', error);
        res.status(500).send('An error occurred while scraping the data.');
    }
});

export default eventsRouter;
