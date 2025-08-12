import { Request, Response } from "express";
import { API_BASE_URL } from "../../secrets";

export const fileHandler = (uploads:any,key="",value="") => {
           const files = uploads as Record<string, Express.Multer.File[]>;
            const uploadedFile = Object.entries(files).map(([fileName, [file]]) => ({
          fileName,
          url: `${API_BASE_URL}/attachment/${file.filename}`,
          key:value
          
      }))

      return uploadedFile
  
}
