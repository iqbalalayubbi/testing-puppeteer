import puppeteer from "puppeteer";
import { createResponse } from "./createResponse.js";
import { autoLogin } from "./autoLogin.js";

export const getAllModule = async (username, password) => {
    const NODE_ENV = process.env.NODE_ENV;
    let puppeteerOptions;

    if (NODE_ENV == "production") {
        puppeteerOptions = { args: ["--no-sandbox"], executablePath: "/usr/bin/chromium-browser" };
    } else {
        puppeteerOptions = { headless: false };
    }

    const browser = await puppeteer.launch(puppeteerOptions);
    const page = await browser.newPage();
    await page.goto("https://ilmu.upnjatim.ac.id/login/index.php?authCAS=NOCAS");

    const data = [];
    const newModule = [];

    try {
        await autoLogin(page, username, password);
        await page.waitForSelector("div.well:last-child div.course-info-container div.media div.media-body h4.media-heading a", { timeout: 3000 });
        await page.$eval("div.well:last-child div.course-info-container div.media div.media-body h4.media-heading a", (el) => el.click());

        await page.waitForSelector("li.section div.content ul.section div.activityinstance a span.instancename");
        // select header date
        const moduleByDate = await page.$$("div#page-content div.container-fluid ul.weeks li.section div.content ul.section li:first-child");

        for (let i = 0; i < moduleByDate.length; i++) {
            const dataModule = { date: "", moduleData: [] };

            // get date module
            const dateModule = await moduleByDate[i].$eval("div", (el) => el.parentElement.parentElement.parentElement.querySelector("h3.sectionname span a").textContent);

            // get total element by date
            const totalModule = await moduleByDate[i].$eval("div", (el) => el.parentElement.parentElement.querySelectorAll("li.activity div.activityinstance span.instancename").length);

            dataModule.date = dateModule;
            for (let x = 0; x < totalModule; x++) {
                const title = await moduleByDate[i].$eval(
                    "div",
                    (el, x) => {
                        return el.parentElement.parentElement.querySelectorAll("li.activity div.activityinstance span.instancename")[x].textContent;
                    },
                    x
                );
                const link = await moduleByDate[i].$eval(
                    "div",
                    (el, x) => {
                        return el.parentElement.parentElement.querySelectorAll("li.activity div.activityinstance a")[x].getAttribute("href");
                    },
                    x
                );
                dataModule.moduleData.push({ title, link });
            }

            dataModule.date = dateModule;
            newModule.push(dataModule);
        }

        await browser.close();
        return newModule;
    } catch (error) {
        console.log(error);
        await browser.close();
        return newModule;
    }
};
