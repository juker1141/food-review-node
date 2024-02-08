import fs from "fs";
import path from "path";
import multer from "multer";

export const getStorageConfig = (targetFolder: string) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const balayAudPath = targetFolder;
      fs.mkdirSync(balayAudPath, { recursive: true });
      cb(null, balayAudPath);
    },
    filename: function (req, file, cb) {
      console.log(file.originalname);
      cb(
        null,
        // timestamp_filename.extname
        `${Date.now()}_${file.originalname}`
      );
    },
  });

export const replaceImageUrl = (url: string) => {
  return url.replace("public", "static");
};
