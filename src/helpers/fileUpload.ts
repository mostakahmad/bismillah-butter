// image upload require functions
import { Request } from 'express';
import multer from 'multer';

// storage function to store file in public/uploads folder
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
    callback(null, './src/public/uploads');
  },
  filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
    callback(null, file.fieldname + "-" + Date.now() + "-" + file.originalname.split(" ").join("-"));
  },
});

// exports upload function with fileFilter to check file type 
export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {

      cb(null, true);
    } else {
      cb(new Error("only .jpg, .jpeg and .png are allowed."));
    }
  },
});