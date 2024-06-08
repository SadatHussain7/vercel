import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
  accessKeyId: "1ac992c90900b806799c3784d97a4a2e",
  secretAccessKey:
    "e939029494ec264d35bb442cd032d4c5563b58ca774e7ddbcff5fe2e3662813f",
  endpoint: "https://74e3cc1153f809cb14794498bb532d22.r2.cloudflarestorage.com",
});

// fileName => output/12312/src/App.jsx
// filePath => /Users/harkiratsingh/vercel/dist/output/12312/src/App.jsx
export const uploadFile = async (fileName: string, localFilePath: string) => {
  const fileContent = fs.readFileSync(localFilePath);
  const response = await s3
    .upload({
      Body: fileContent,
      Bucket: "vercel",
      Key: fileName,
    })
    .promise();
  console.log(response);
};
