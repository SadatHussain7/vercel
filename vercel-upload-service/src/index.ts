// id - 1ac992c90900b806799c3784d97a4a2e
// secret - e939029494ec264d35bb442cd032d4c5563b58ca774e7ddbcff5fe2e3662813f
// endpoint - https://74e3cc1153f809cb14794498bb532d22.r2.cloudflarestorage.com

import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import path from "path";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";
import { createClient } from "redis";

const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl; // Actual GitHub URL
  const id = generate();
  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

  const files = getAllFiles(path.join(__dirname, `output/${id}`));

  files.forEach(async (file) => {
    await uploadFile(file.slice(__dirname.length + 1), file);
  });

  await new Promise((resolve) => setTimeout(resolve, 5000));

  publisher.lPush("build-queue", id);
  publisher.hSet("status", id, "uploaded");

  res.json({ message: "Uploaded the repository...", id });
});

app.listen(7000, () => {
  console.log("Server running on port 7000");
});

app.get("/status", async (req, res) => {
  const id = req.query.id;
  const response = await subscriber.hGet("status", id as string);
  res.json({
    status: response,
  });
});
