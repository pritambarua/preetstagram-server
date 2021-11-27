import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import routes from "./routes/route.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json({limit: "30mb", extended: "true"}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: "true"}));
app.use('/posts', routes);

app.get('/', (req, res) => {
    res.status(200).send('welcome');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>app.listen(PORT,()=>{console.log(`server running on PORT ${PORT}`)}))
.catch((err) => {console.log(`${err.message} did not connect`)});