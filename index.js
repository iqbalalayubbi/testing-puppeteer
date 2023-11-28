import express from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 4001 || process.env.PORT;

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));

// router
import { moduleRouter } from "./router/module.js";
import { taskRouter } from "./router/tasks.js";

app.use("/modules", moduleRouter);
app.use("/tasks", taskRouter);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
