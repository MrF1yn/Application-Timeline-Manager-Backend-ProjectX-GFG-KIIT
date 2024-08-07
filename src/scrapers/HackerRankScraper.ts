import {EventData, Scraper} from "./Scraper";
import axios from "axios";
import cheerio from "cheerio";

export class HackerRankScraper extends Scraper {

    constructor() {
        super('hackerrank');
    }

    async scrapeEventPage(eventLink: string): Promise<EventData | null> {
        let type = 'challenge';
        let eventName;
        let startTime;
        let endTime;
        if (eventLink.startsWith("https://www.hackerrank.com/contests")) {
            const eventName = eventLink.split("/")[4];
            eventLink = "https://www.hackerrank.com/" + eventName;
            type = 'contest';
        }

        try {
            const response = await axios.get(eventLink, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 OPR/107.0.0.0'
                }
            });
            const $ = cheerio.load(response.data);
            console.log($.html());
            switch (type) {

            }
            switch (type){
                case 'challenge':
                    eventName = $('h1[class=competition__name]').text();
                    startTime = $('span[data-automation=test-start-time]').text();
                    endTime = $('span[data-automation=test-end-time]').text();
                    break;
                case 'contest':
                    eventName = $('h1[class=competition__name]').text();
                    startTime = $('span[data-automation=test-start-time]').text();
                    endTime = $('span[data-automation=test-end-time]').text();
                    break;
            }
            return {
                eventName: eventName,
                startDate: startTime,
                endDate: endTime,
                eventUrl: eventLink
            };
        } catch (error) {
            console.error(error);
            return null;
        }


    }


}