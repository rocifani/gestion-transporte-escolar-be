import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./database/db";
import routes from "./routes/routes";


dotenv.config();

const app = express();
app.use(cors({origin: "*"}));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", async (_req, res) => { // TO DO: cambiar esto
  const results = await db.query("SELECT * FROM role");
  res.json(results);
});

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
