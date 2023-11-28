import express from "express";
import { getAllModule } from "../controller/getModule.js";
export const moduleRouter = express.Router();

moduleRouter.post("/", async (req, res) => {
    const { username, password } = req.body;
    try {
        const resultData = await getAllModule(username, password);
        res.json(resultData);
    } catch (err) {
        console.log(err);
        res.json({ message: "server error" });
    }
});
