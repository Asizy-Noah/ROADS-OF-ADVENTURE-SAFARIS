// src/config/multer.config.ts

import { diskStorage } from "multer";
import { extname } from "path";
import { v4 as uuidv4 } from "uuid";
import { HttpException, HttpStatus } from "@nestjs/common";
import * as fs from 'fs';

// Define the base upload directory where all subfolders (blogs, pages, etc.) will reside
const baseUploadDir = "./uploads";

// Export a function that returns MulterOptions based on a specific subfolder.
// This function will also ensure the subfolder exists.
export const getMulterConfig = (subfolder: string) => {
  const uploadDir = `${baseUploadDir}/${subfolder}`;

  // Ensure the base upload directory exists when the config is accessed
  if (!fs.existsSync(baseUploadDir)) {
    
    fs.mkdirSync(baseUploadDir, { recursive: true });
  }

  // Ensure the specific subfolder directory (e.g., 'uploads/pages' or 'uploads/blogs') exists
  if (!fs.existsSync(uploadDir)) {
   
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return {
    storage: diskStorage({
      destination: uploadDir, // Multer will save files to this dynamic directory
      filename: (req, file, callback) => {
        const uniqueSuffix = uuidv4();
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        
        callback(null, filename);
      },
    }),
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

// You can still keep a default export for 'blogs' if many routes use it,
// but it's better to explicitly call getMulterConfig('blogs') where needed.
// export const multerConfig = getMulterConfig('blogs'); // <-- Example if you prefer this