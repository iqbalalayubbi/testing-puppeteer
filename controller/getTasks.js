import puppeteer from "puppeteer";
import { createResponse } from "./createResponse.js";
import { autoLogin } from "./autoLogin.js";
import fs from "fs/promises";

export const getAllTasks = async (username, password) => {
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

    const tasks = [];

    try {
        // login
        await autoLogin(page, username, password);
        const cookies = await page.cookies();
        await fs.writeFile("./cookies.json", JSON.stringify(cookies));
        page.title().then((res) => console.log(res));
        try {
            await page.waitForSelector("div.content div.event a", { timeout: 3000 });
            const elements = await page.$$("div.content div.event");
            for (let i = 0; i < elements.length; i++) {
                const title = await elements[i].$eval("a", (el) => el.innerHTML);
                const linkTask = await elements[i].$eval("a", (el) => el.getAttribute("href"));
                const subject = await elements[i].$eval("div.course a", (el) => el.innerHTML);
                const deadline = await elements[i].$eval("div.date a", (el) => el.textContent);
                const taskData = {};
                taskData.title = title;
                taskData.link = linkTask;
                taskData.subject = subject;
                taskData.deadline = deadline;
                tasks.push(taskData);
            }
            for (let i = 0; i < tasks.length; i++) {
                await page.goto(tasks[i].link);
                await page.waitForSelector("input[type=submit]", { timeout: 3000 });
                const status = await page.$eval(".cell.c1", (el) => el.innerHTML);
                tasks[i].status = status;
            }
            await browser.close();
            return createResponse(tasks, true, "Tugas berhasil didapatkan");
        } catch (err) {
            await browser.close();
            return createResponse(tasks, true, "Tugas tidak ada");
        }
    } catch (err) {
        await browser.close();
        return createResponse(tasks, false, "Gagal Login");
    }
};
