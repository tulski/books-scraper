import { writeFile } from "fs";
import { runInBrowser } from "./scraping/runInBrowser";
import { BooksScraper } from "./books/booksScraper";

const FILENAME = "data.json";

const main = async () => {
    const books = await runInBrowser((browser) =>
        new BooksScraper(() => browser.newPage()).scrape()
    );

    writeFile(FILENAME, JSON.stringify(books, null, 4), (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
};

main().catch((e) => console.error(e));
