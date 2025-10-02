// backend/src/config/storage.js
import { v2 as cloudinary } from "cloudinary";
import { S3Client } from "@aws-sdk/client-s3";

const provider = process.env.STORAGE_PROVIDER;

let storageConfig;

if (provider === "cloudinary") {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  storageConfig = { cloudinary };
  console.log("Using Cloudinary for image storage.");
} else if (provider === "s3") {
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  storageConfig = { s3 };
  console.log("Using AWS S3 for image storage.");
} else {
  console.warn("No storage provider configured. Image uploads will fail.");
}

export default storageConfig;
