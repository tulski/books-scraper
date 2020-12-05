import { Book } from "../models/book.model";

export function getAllTitledLinks() {
    return Array.from(document.querySelectorAll("h3 > a"), (element) => ({
        title: element.textContent!.trim(),
        link: (element as HTMLAnchorElement).href,
    }));
}

export function getNextPage() {
    const nextButtonHandler = document.querySelector(
        "li.next > a"
    ) as HTMLAnchorElement;
    if (nextButtonHandler) {
        nextButtonHandler.click();
        return true;
    } else return false;
}

export function scrapeBook({ link }: TitledLink) {
    const title = getTitle();
    const price = getPrice();
    const inStock = getInStock();
    const UPC = getParam("UPC");
    const productType = getParam("Product Type");
    const numberOfReviews = Number(getParam("Number of reviews"));

    return {
        title,
        price,
        inStock,
        link,
        UPC,
        productType,
        numberOfReviews,
    };

    function getTitle() {
        return document
            .querySelectorAll("div.product_main > h1")[0]
            .textContent!.trim();
    }

    function getPrice() {
        return Number(
            document
                .getElementsByClassName("price_color")[0]
                .textContent!.replace("£", "")
                .trim()
        );
    }

    function getInStock() {
        return Number(
            document
                .getElementsByClassName("instock availability")[0]
                .textContent!.replace(/[^0-9]/g, "")
        );
    }

    function getParam(paramName: string) {
        return Array.from(document.querySelectorAll("tbody > tr"))
            .filter((element) => element.textContent!.includes(paramName))[0]
            .querySelector("td")!
            .innerText.trim();
    }
}
