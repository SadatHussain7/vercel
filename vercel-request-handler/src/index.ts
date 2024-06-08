import express from "express";
// import { S3 } from "aws-sdk";

const app = express();

app.get("/*", async (req, res) => {
  const host = req.hostname;
  const id = host.split(".")[0];
  console.log("id", id);
});

app.listen(3001);
console.log("Server running on port 3001");
