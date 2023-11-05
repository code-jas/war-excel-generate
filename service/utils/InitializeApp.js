import dotenv from "dotenv";
dotenv.config();
const APP_PORT =  process.env.APP_PORT || 100;


export default class InitializeApp { 
    static async init(app) {
        try{
            app.listen(APP_PORT, () => {
                console.log(
                  "\x1b[36m",
                  "Server Local Time: ",
                  new Date().toLocaleString("en-US", {
                    hour12: true,
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Manila",
                  }),
                  "\x1b[0m"
                );
                console.log(`WARS SERVICE started at port: ${APP_PORT}`);
              });
        }catch(e){
            console.error("Error in initialization...");
            console.error(e);
        }
    }
}