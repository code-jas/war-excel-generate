import express from "express";
import ClockifyController from "../controllers/clockify.controller.js";

class ClockifyRouter { 
    constructor() { 
        this.router = express.Router();
        this.clockifyController = new ClockifyController();
        
        this.router.post("/time-entries", this.clockifyController.getTimeEntries);
        // this.router.post("/time-entries2", this.clockifyController.getTimeEntries2);
        this.router.post("/generate-war", this.clockifyController.generateWar);
    }

    getRouter() { 
        return this.router;
    }
}

export default ClockifyRouter;

