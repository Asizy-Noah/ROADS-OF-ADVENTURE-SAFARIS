// src/config/multer.config.ts

import { memoryStorage } from "multer"; // Changed from diskStorage
import { extname } from "path";
import { HttpException, HttpStatus } from "@nestjs/common";
// import * as fs from 'fs'; // No longer needed for local disk operations

// Define the base upload directory where all subfolders (blogs, pages, etc.) will reside
// const baseUploadDir = "./uploads"; // No longer needed for local disk operations

// Export a function that returns MulterOptions based on a specific subfolder.
// This function will now use memoryStorage.
export const getMulterConfig = (subfolder: string) => { // 'subfolder' is now just a logical grouping for GCS, not a local path
  // Local directory creation logic removed as files are stored in memory then GCS.
  // if (!fs.existsSync(baseUploadDir)) {
  //   fs.mkdirSync(baseUploadDir, { recursive: true });
  // }
  // if (!fs.existsSync(uploadDir)) {
  //   fs.mkdirSync(uploadDir, { recursive: true });
  // }

  return {
    storage: memoryStorage(), // <--- Changed to memoryStorage()
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return callback(new HttpException("Only image files are allowed!", HttpStatus.BAD_REQUEST), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  };
};