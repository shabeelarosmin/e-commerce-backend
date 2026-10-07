import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import indexRoute from "./src/routes/index.route.js";


import dbConnect from "./db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());


app.use("/api", indexRoute);




dbConnect();

app.listen(PORT, () => {
  console.log(`Server is running PORT=${PORT}`);
});
