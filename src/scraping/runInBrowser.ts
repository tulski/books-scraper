import * as puppeteer from "puppeteer";
import { Browser } from "puppeteer";

export async function runInBrowser<T>(
    callback: (browser: Browser) => Promise<T>
) {
    const browser = await puppeteer.launch({ headless: false, devtools: true });
    try {
        return await callback(browser);
    } finally {
        await browser.close();
    }
}
