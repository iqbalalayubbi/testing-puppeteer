import puppeteer from "puppeteer";
import { createResponse } from "./createResponse.js";

export const uploadTask = async (username, password) => {
    const NODE_ENV = process.env.NODE_ENV;
    let puppeteerOptions;

    if (NODE_ENV == "production") {
        puppeteerOptions = { args: ["--no-sandbox"], executablePath: "/usr/bin/chromium-browser" };
    } else {
        puppeteerOptions = { headless: false };
    }

    const browser = await puppeteer.launch(puppeteerOptions);
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto("https://ilmu.upnjatim.ac.id/login/index.php?authCAS=NOCAS");

    try {
        // login upn
        await page.focus("#username");
        await page.keyboard.type(username);
        await page.focus("#password");
        await page.keyboard.type(password);
        await page.$eval("#loginbtn", (el) => el.click());

        // check login status
        await page.waitForResponse("https://ilmu.upnjatim.ac.id/my/", { timeout: 3000 });

        // go to taks page
        await page.waitForSelector("h4.media-heading");
        await page.goto("https://ilmu.upnjatim.ac.id/mod/assign/view.php?id=210859");
        await page.$eval("div.singlebutton input[type=submit]", (el) => el.click());

        // waiting navigation task
        await page.waitForNavigation({ waitUntil: "load" });
        await page.goto("https://ilmu.upnjatim.ac.id/mod/assign/view.php?id=210859&action=editsubmission");

        // click the upload file icon
        await Promise.all([page.waitForSelector("div.fp-btn-add a", { visible: true }), page.click("div.fp-btn-add a")]);

        // choose file to upload
        await page.waitForSelector("div.fp-file div.controls input[type=file]", { visible: true });
        const [fileChoose] = await Promise.all([page.waitForFileChooser(), page.click("div.fp-file div.controls input[type=file]")]);
        await fileChoose.accept(["./test.txt"]);

        // click unggah file
        await page.waitForSelector("div.fp-file div.controls input[type=file]", { visible: true });
        await page.click("div.fp-upload-form div.mdl-align button.fp-upload-btn");

        // click simpan perubahan
        await page.waitForSelector("div#fgroup_id_buttonar div.felement input[type=submit]", { visible: true });
        const button = await page.$("div#fgroup_id_buttonar div.felement input[type=submit]");
        await button.evaluate((el) => el.click());
        console.log("sukses");

        await browser.close();
        return true;
    } catch (error) {
        console.log(error);
        await browser.close();
        return false;
    }
};
