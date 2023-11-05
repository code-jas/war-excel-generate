import express from "express";
import ClockifyController from "../controllers/clockify.controller.js";

class ClockifyRouter { 
    constructor() { 
        this.router = express.Router();
        this.clockifyController = new ClockifyController();
        
        this.router.get("/time-entries", this.clockifyController.getTimeEntries);
    }

    getRouter() { 
        return this.router;
    }
}

export default ClockifyRouter;

