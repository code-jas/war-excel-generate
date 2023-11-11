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
            // console.log('result :>> ', result);
            
            // console.log('generateWar :>> ', generateWar);
            res.status(200).json({status: "success", data: result});
        } catch(e){
            // console.log('error :>> ', e);
            res.status(500).json({status: "error", message: e.message});
        }
    };

    async generateWar(req, res) {
        try{
            const reqData = req.body;
            // console.log('req data :>> ', reqData);

            const reportItems = []
            reqData?.warData?.map((item) => 
                    reportItems.push({
                    "columns": Object.entries(item)
                        .filter(([key, _]) => {
                            if(item.status ==='day') { 
                                return key !== 'status' && key !== 'totalDurationPerDay'  && key !== 'formattedDuration'
                            } else  {
                                return key !== 'status' && key !== 'duration'
                            }
                        }
                        )
                        .map(([_, value]) => value)
                    })
            );
            const excelData = {
                name: "John Angelo B. Silvestre",
                position: "Instructor",
                periodCovered: "July 20, 2020 - July 24, 2020",
                war: reportItems
            }
            console.log('excelData :>> ', JSON.stringify(excelData,null, 2));
            const warResult = await XLSPrinter.print("/war-template.xlsx", excelData)
            res.status(200).json({status: "success", data: warResult});
        } catch(e){
            // console.log('error :>> ', e);
            res.status(500).json({status: "error", message: e.message});
        }
    }
}
