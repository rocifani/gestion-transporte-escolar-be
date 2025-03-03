import express from "express";
import diaryRouter from "./routes/diaries.ts";


const app = express();
app.use(express.json());

const PORT = 3000;

app.get("/", (_req, res) => {
  console.log("hola");
  res.send("Hello World");
});

app.use("/api/diaries", diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
