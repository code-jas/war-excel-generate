import express from "express";
import cors from "cors";
import helmet from "helmet";
import InitializeApp from "./utils/InitializeApp.js";
import routes from "./routes/index.js";


const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/api', routes);


app.get("/", checkRequest);

function checkRequest(req, res) {
  res.send(`wars-generator service is running... Server time is ${new Date().toLocaleString()}`);
}

InitializeApp.init(app);
