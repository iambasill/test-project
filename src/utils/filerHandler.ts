import { Request, Response } from "express";
import { API_BASE_URL } from "../../secrets";

export const fileHandler = (uploads:any,id:any) => {
           const files = uploads as Record<string, Express.Multer.File[]>;
            const uploadedFile = Object.entries(files).map(([fileName, [file]]) => ({
          fileName,
          url: `${API_BASE_URL}/attachment/${file.filename}`,
          id
          
      }))

      return uploadedFile
  
}
