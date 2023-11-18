import puppeteer from "puppeteer";
import express from "express";
import "dotenv/config";

const app = express();
const PORT = 3000 || process.env.PORT;

const data = {
    username: process.env.USERNAME_DATA,
    password: process.env.PASSWORD,
};

app.use(express.json());

const scrappingData = async () => {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();

    await page.goto("https://ilmu.upnjatim.ac.id/login/index.php?authCAS=NOCAS");
    // await page.setViewport({ width: 1080, height: 1024 });

    // const element = await page.waitForSelector("span.newsearch a");
    // const valueElement = await element.evaluate((el) => el.textContent);
    // console.log(valueElement);

    // const element = await page.$eval("span.newsearch a", (el) => el.innerText);
    // console.log(element);
    // const tasks = [];
    const dataTitle = await page.title();

    // await page.locator("#username").fill(data.username);
    // await page.locator("#password").fill(data.password);
    // await page.locator("#loginbtn").click();

    // await page.waitForSelector("div.content div.event a");
    // const elements = await page.$$("div.content div.event");

    // for (let i = 0; i < elements.length; i++) {
    //     const title = await elements[i].$eval("a", (el) => el.innerHTML);
    //     const subject = await elements[i].$eval("div.course a", (el) => el.innerHTML);
    //     const deadline = await elements[i].$eval("div.date a", (el) => el.textContent);

    //     const taskData = {};
    //     taskData.title = title;
    //     taskData.subject = subject;
    //     taskData.deadline = deadline;
    //     tasks.push(taskData);
    // }

    await browser.close();
    return dataTitle;
};

app.get("/", async (req, res) => {
    try {
        const taskData = await scrappingData();
        res.json(taskData);
    } catch (err) {
        console.log(err);
        res.json({ message: "error" });
    }
});

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));

module.exports = app;
