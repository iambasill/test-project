import { config } from "../config";

export interface FileRecord {
  fileName: string;
  fileUrl: string;
  fileType?: string;  // <-- add
  fileSize?: number;  // <-- add
  keyId: string;      // e.g., "userId" or "equipmentId"
  keyValue: string;   // e.g., "abc123"
}

/**
 * Get structured file info for a single file.
 */
export const getFileUrl = (
  file: Express.Multer.File,
  keyId: string,
  keyValue: string
): FileRecord => {
  if (!file) {
    throw new Error("File not provided");
  }

  const fileName = file.originalname || file.filename;
  const fileType = file.mimetype;
  const fileSize = file.size;

  // 1️⃣ Remote/Absolute URL (already hosted somewhere)
  if (file.path && file.path.startsWith("http")) {
    return {
      fileName,
      fileUrl: file.path,
      fileType,
      fileSize,
      keyId,
      keyValue,
    };
  }

  // 2️⃣ AWS S3 Upload (via multer-s3)
  if ((file as any).location) {
    return {
      fileName,
      fileUrl: (file as any).location,
      fileType,
      fileSize,
      keyId,
      keyValue,
    };
  }

  // 3️⃣ Local Storage (via multer diskStorage)
  if (file.filename) {
    return {
      fileName,
      fileUrl: `${config.API_BASE_URL}/attachment/${file.filename}`,
      fileType,
      fileSize,
      keyId,
      keyValue,
    };
  }

  throw new Error("Unable to determine file URL");
};

/**
 * Get structured file info for multiple files.
 */
export const getFileUrls = (
  files: Express.Multer.File[],
  keyId: string,
  keyValue: string
): FileRecord[] => {
  if (!files || files.length === 0) return [];
  return files.map(file => getFileUrl(file, keyId, keyValue));
};
