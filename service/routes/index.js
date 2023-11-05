import express from "express";
import ClockifyRouter from "./clockify.js";

const router = express.Router();
const clockifyRouter = new ClockifyRouter

router.use("/clockify", clockifyRouter.getRouter());

export default router;