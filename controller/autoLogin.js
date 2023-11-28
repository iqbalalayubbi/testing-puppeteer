export const autoLogin = async (page, username, password) => {
    try {
        await page.waitForSelector("#loginbtn");
        await page.focus("#username");
        await page.keyboard.type(username);
        await page.focus("#password");
        await page.keyboard.type(password);
        await page.$eval("#loginbtn", (el) => el.click());
        await page.waitForResponse("https://ilmu.upnjatim.ac.id/my/", { timeout: 3000 });
        return true;
    } catch (error) {
        return error;
    }
};
