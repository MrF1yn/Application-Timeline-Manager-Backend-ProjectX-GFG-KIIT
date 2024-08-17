import {Scraper} from "./Scraper.js";
import axios from "axios";
import cheerio from "cheerio";
import puppeteer from "puppeteer";

export class DevpostScraper extends Scraper {

    browser;
    page;
    constructor() {
        super('devpost');
        console.log("Initializing Devpost Scraper! Starting Puppeteer.")
        this.init().then(()=>{
            console.log("Puppeteer Started, Devpost Scraper Ready!")
        })
    }

    async init(){
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
    }

    async scrapeEventPage(eventLink){
        console.log("DEVPOST")
        let eventName = '';
        let startTime = "";
        let endTime = "";
        let type = "";
        let registrations = "";
        let rewards = "";
        let link = "";
        let imageUrl = "";
        let companyName = "";
        let activeEvents =[];
        try {
            await this.page.goto(eventLink);
            await this.page.setViewport({width: 1080, height: 1024});
            await this.page.waitForSelector(".hackathons-container", { timeout: 5_000 });
            const $ = cheerio.load(await this.page.content());
            $(".hackathons-container .hackathon-tile").toArray().forEach((elem)=>{
               const data = $(elem);
               eventName = data.find('h3').text();
               endTime = data.find('.submission-period').text();
               type = data.find('.info-with-icon').text();
               registrations = data.find('.participants').text();
               rewards = data.find('.prize').text();
               imageUrl = data.find('.hackathon-thumbnail').attr('src');
               companyName = data.find('.host-label').text();
               link = data.find('.tile-anchor').attr('href');
               activeEvents.push({
                   eventName: eventName,
                   startTime: startTime,
                   endTime: endTime,
                   type: type,
                   registrations: registrations,
                   rewards: rewards,
                   imageUrl: imageUrl,
                   companyName: companyName,
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