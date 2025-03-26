import express from "express";
import dotenv from "dotenv";
import AppDataSource from "./database/db";
import routes from "./routes/routes";
import cors from 'cors';
import fs from 'fs';
import https from 'https';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", routes);

const PORT = process.env.PORT || 3000;
const HTTPS_PORT = 3443;

const httpsOptions = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
}

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
      console.log(`Server running on HTTPS: https://localhost:${HTTPS_PORT}`);
    });
  })
  .catch((error) => console.error(error));

