import dotenv from "dotenv";
import moment from "moment";
import axios from "../config/axiosConfig.js";
import Clockify from "../utils/Clockify.js";
import XLSPrinter from "../utils/XLSPrinter.js";
dotenv.config();

const workspaceId = process.env.CLOCKIFY_WORKSPACE_ID || "";
const userId = process.env.CLOCKIFY_USER_ID || "";
console.log('workspaceId :>> ', workspaceId);

export default class ClockifyController { 
    constructor() { 

    }

    async getTimeEntries(req, res) {
        try{
            let response = (await axios.get(`/workspaces/${workspaceId}/user/${userId}/time-entries`)).data;
            response = response.sort((a, b) => new Date(a.timeInterval.start) - new Date(b.timeInterval.start));
            // console.log('response :>> ', response);
            const result = await Clockify.getWeeklyReport(response);
            console.log('result :>> ', result);
            // let report = await XLSPrinter.printMultipleSheet("/dynamic-class-record.xlsx", data);
            const excelData = {
                name: "John Angelo B. Silvestre",
                position: "Instructor",
                periodCovered: "July 20, 2020 - July 24, 2020",
                war: [
                    {
                        date: "08:00:00 AM",
                        startTime: "08:00:00 AM",
                        endTime: "09:23:04 AM",
                        formattedDuration: "01:23:04",
                        duration: 4984
                    },
                    {
                        date: "09:23:00 AM",
                        startTime: "09:23:00 AM",
                        endTime: "11:09:00 AM",
                        formattedDuration: "01:46:00",
                        duration: 6360
                    },
                ]
            }
            const generateWar = await XLSPrinter.print("/war-template.xlsx", excelData)
            // console.log('generateWar :>> ', generateWar);
            res.status(200).json({status: "success", data: result, war: generateWar});
        } catch(e){
            // console.log('error :>> ', e);
            res.status(500).json({status: "error", message: e.message});
        }
    };
}
