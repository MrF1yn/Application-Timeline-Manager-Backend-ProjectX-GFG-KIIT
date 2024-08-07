export abstract class Scraper{
    private scraperType: string;

    protected constructor(scraperType: string) {
        this.scraperType = scraperType;
    }

    public get getScraperType(){
        return this.scraperType;
    }

    abstract scrapeEventPage(eventLink: string): Promise<EventData | null>;

}

export interface EventData{
    eventName: string
    startDate: string
    endDate: string
    eventUrl: string
}