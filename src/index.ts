import express from "express";
import db from "./database/db";
import routes from "./routes/routes";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", async (_req, res) => {
  const results = await db.query("SELECT * FROM role");
  res.json(results);
});

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
