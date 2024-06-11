import express from "express";
import { S3 } from "aws-sdk";

const app = express();

const s3 = new S3({
  accessKeyId: "1ac992c90900b806799c3784d97a4a2e",
  secretAccessKey: "e939029494ec264d35bb442cd032d4c5563b58ca774e7ddbcff5fe2e3662813f",
  endpoint: "https://74e3cc1153f809cb14794498bb532d22.r2.cloudflarestorage.com"
})

app.get("/*", async (req, res) => {
  const host = req.hostname;
  const id = host.split(".")[0];
  console.log("id", id);
  const filePath = req.path;

  const contents = await s3
    .getObject({
      Bucket: "vercel",
      Key: `dist/${id}${filePath}`,
    })
    .promise();

  const type = filePath.endsWith("html")
    ? "text/html"
    : filePath.endsWith("css")
    ? "text/css"
    : "application/javascript";
  res.set("Content-Type", type);

  res.send(contents.Body);
});

app.listen(3001);
console.log("Server running on port 3001");
