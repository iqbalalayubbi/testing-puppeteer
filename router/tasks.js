import express from "express";
import { getAllTasks } from "../controller/getTasks.js";
export const taskRouter = express.Router();

taskRouter.post("/", async (req, res) => {
    const { username, password } = req.body;
    try {
        const resultData = await getAllTasks(username, password);
        if (resultData.status) res.json(resultData);
        else res.json(resultData);
    } catch (err) {
        console.log(err);
        res.json({ message: "server error" });
    }
});
