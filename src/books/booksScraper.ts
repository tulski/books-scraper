import { Page } from "puppeteer";
import { runInPage } from "../scraping/runInPage";
import { getAllTitledLinks, getNextPage, scrapeBook } from "./booksFunctions";
import { TitledLink } from "../models/titledLink.model";
import { Book } from "../models/book.model";

export class BooksScraper {
    constructor(private readonly pageFactory: () => Promise<Page>) {}

    public async scrape() {
        return runInPage(this.pageFactory, async (page) => {
            const titledLinks = await this.getAllTitledLinks(page);
            return await this.scrapeLinks(page, titledLinks);
        });
    }

    private async getAllTitledLinks(page: Page) {
        await page.goto("http://books.toscrape.com/");
        const titledLinks: TitledLink[] = [];
        do {
            const pageTitledLinks = await page.evaluate(getAllTitledLinks);
            titledLinks.push(...pageTitledLinks);
        } while (await this.getNextPage(page));

        return titledLinks;
    }

    private async getNextPage(page: Page) {
        if (await page.evaluate(getNextPage)) {
            await page.waitForNavigation();
            return true;
        } else return false;
    }

    private async scrapeLinks(page: Page, titledLinks: TitledLink[]) {
        const books: Book[] = [];
        for (const titledLink of titledLinks) {
            const book = await this.scrapeBook(page, titledLink);
            books.push(book);
        }
        return books;
    }

    private async scrapeBook(page: Page, titledLink: TitledLink) {
        await page.goto(titledLink.link);
        return await page.evaluate(scrapeBook, { ...titledLink });
    }
}
