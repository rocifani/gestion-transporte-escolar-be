import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send("Hello World");
});

router.post("/", (req, res) => {
    const { title, content } = req.body;
    res.send(`Title: ${title}, Content: ${content}`);
    });