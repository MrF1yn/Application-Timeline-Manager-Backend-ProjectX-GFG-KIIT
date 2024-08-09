import axios from "axios";
import cheerio from "cheerio";
import { Scraper, EventData } from "./Scraper.js";

export class HackerEarthScraper extends Scraper {
    constructor() {
        super('hackerearth');
    }

    async scrapeEventPage(eventLink) {
        try {
            const response = await axios.get(eventLink);
            if (response.status === 200) {
                const $ = cheerio.load(response.data);

                const ongoingHackathonsSection = $(".ongoing.challenge-list");
                const upcomingHackathonsSection = $(".upcoming.challenge-list");

                const events = [];

                // Scrape Ongoing Challenges
                ongoingHackathonsSection.find('.challenge-card-modern').each((index, element) => {
                    const title = $(element).find('.challenge-list-title').text().trim();
                    let link = $(element).find('.challenge-card-wrapper').attr('href');
                    const imageUrl = $(element).find('.event-image').css('background-image').replace(/url\(['"]?(.*?)['"]?\)/, '$1');
                    const companyName = $(element).find('.company-details').text().trim();
                    const registrations = $(element).find('.registrations').text().trim();
                    const startTime = $(element).find('.start-time-block .regular.bold.desc.dark').text().trim();
                    const endTime = $(element).find('.end-time-block .regular.bold.desc.dark').text().trim();

                    if (link && !link.startsWith('http')) { 
                        link = `https://assessment.hackerearth.com${link}`;
                    }

                    events.push(new EventData({
                        title,
                        companyName,
                        registrations,
                        startTime,
                        endTime,
                        imageUrl,
                        link,
                        status: "ongoing"
                    }));
                });

                // Scrape Upcoming Challenges
                upcomingHackathonsSection.find('.challenge-card-modern').each((index, element) => {
                    const title = $(element).find('.challenge-list-title').text().trim();
                    let link = $(element).find('.challenge-card-wrapper').attr('href');
                    const imageUrl = $(element).find('.event-image').css('background-image').replace(/url\(['"]?(.*?)['"]?\)/, '$1');
                    const companyName = $(element).find('.company-details').text().trim();
                    const registrations = $(element).find('.registrations').text().trim();
                    const startTime = $(element).find('.challenge-desc .date.dark').text().trim(); // Adjusted selector for start time

                    if (link && !link.startsWith('http')) { 
                        link = `https://assessment.hackerearth.com${link}`;
                    }

                    events.push(new EventData({
                        title,
                        companyName,
                        registrations,
                        startTime,
                        imageUrl,
                        link,
                        status: "upcoming"
                    }));
                });

                return events;
            } else {
                console.error(`Failed to retrieve the page with status code: ${response.status}`);
                return null;
            }
        } catch (error) {
            console.error('An error occurred while scraping the event page:', error);
            return null;
        }
    }
}
