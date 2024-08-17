import {Scraper} from "./Scraper.js";
import axios from "axios";
import cheerio from "cheerio";

export class HackerRankScraper extends Scraper {

    constructor() {
        super('hackerrank');
    }

    async scrapeEventPage(eventLink){
        let eventName = '';
        let startTime = "";
        let endTime = "";
        let link = "";
        let activeEvents =[];
        try {
            const response = await axios.get(eventLink, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 OPR/107.0.0.0'
                }
            });
            const $ = cheerio.load(response.data);
            // console.log($.html());
            $('.active-contest-container ul').toArray().forEach(elem=>{
                eventName = $(elem).find('.contest-item-title').text();
                startTime = $(elem).find('.contest-status').text();
                link = "https://www.hackerrank.com"+$(elem).find('a').attr('href');
                activeEvents.push({
                    eventName: eventName,
                    startTime: startTime,
                    endTime: endTime,
                    link: link
                })
            });
            return activeEvents;
        } catch (error) {
            console.error(error);
            return null;
        }


    }


}