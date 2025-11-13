import  fs  from "fs"
import  path  from "path" 
import  multer from "multer"
import  multerS3   from "multer-s3"
import  { S3Client }  from "@aws-sdk/client-s3" 
import  { BadRequestError }   from "../logger/exceptions"
import { config } from "../config"

let upload:any;


const fileFilter = (req:any, file:any, cb:any) => {
  const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/jpg",
  "image/bmp",
  "image/tiff",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError("Invalid file type"), false);
  }
};

//
// ✅ S3 Storage
//
if (config.STORAGE_ENV === "cloud") {
  const s3 = new S3Client({
    region: config.cloud?.CLOUD_REGION || "",
    credentials: {
      accessKeyId: config.cloud?.CLOUD_ACCESS_KEY_ID || "",
      secretAccessKey: config.cloud?.CLOUD_SECRET_ACCESS_KEY || "",
    },
  });

  upload = multer({
    storage: multerS3({
      s3,
      bucket: (config as any).CLOUD_BUCKET_NAME || "",
      acl: "public-read", // set to "private" if you want restricted access
      key: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, `uploads/${fileName}`);
      },
    }),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  });
}

//
// ✅ Local Storage (Fallback)
//

else {
  const uploadDir = path.join(__dirname, "../../public/uploads");

  // Ensure the directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    fs.chmodSync(uploadDir, 0o777);
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  });

  upload = multer({
    storage,
    fileFilter,
    // limits: { fileSize: 5 * 1024 * 1024 }, //TODO:
  });
}


export default upload
