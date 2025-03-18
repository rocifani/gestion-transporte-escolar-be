import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./database/db";
import routes from "./routes/routes";
import cors from 'cors';

dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());
app.use("/", routes);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.error(error));

