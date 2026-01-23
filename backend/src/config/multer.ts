import multer, { type FileFilterCallback, MulterError } from "multer";
import fs from "fs";
import path from "path";
import type { Request, Response, NextFunction } from "express";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "/image");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// File filter
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images  are allowed."));
  }
};

// Initialize Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // limit for 5MB
  },
});

// Safe wrapper for route-level usage
export const handleFileUpload = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const singleUpload = upload.single(fieldName);

      singleUpload(req, res, (err?: any) => {
        try {
          if (err instanceof MulterError) {
            res.status(400).json({
              isSuccess: false,
              message: `Multer error: ${err.message}`,
            });
            return;
          }

          if (err) {
            res.status(400).json({
              isSuccess: false,
              message: `Upload error: ${err.message}`,
            });
            return;
          }

          next();
        } catch (innerErr) {
          console.error("Multer internal error:", innerErr);
          res.status(500).json({ message: "Internal server error" });
          return;
        }
      });
    } catch (outerErr) {
      console.error("Unexpected Multer wrapper error:", outerErr);
      res.status(500).json({ message: "File upload failed" });
      return;
    }
  };
};

export default upload;