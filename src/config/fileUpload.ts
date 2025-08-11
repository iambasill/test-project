import express from 'express';
import multer from 'multer';
import path from 'path';
import { BadRequestError } from '../httpClass/exceptions';

const app = express();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for validation
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  // Allow only specific file types
  const allowedTypes = [
  'image/jpeg', 
  'image/png', 
  'image/gif', 
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Invalid file type'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});


  //  if (req.files) {
  //   const files = req.files as Record<string, Express.Multer.File[]>;
  //   const fileData = Object.entries(files).map(([fileName, [file]]) => ({
  //     fileName,
  //     url: file.path.toString(),
  //     equipmentId: equipmentChasisNumber
  //   }));

  // equipmentRouter.put('/:id', upload.fields(UPLOAD_FIELDS), updateEquipment);
  