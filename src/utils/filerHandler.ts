import { Request, Response } from "express";

export const fileHandler = (request:any) => {
    const files = request.files as Record<string, Express.Multer.File[]>;
    const fileData = Object.entries(files).map(([fileName, [file]]) => ({
      fileName,
      url: file.path.toString(),
        }));
    
        return fileData
}

export const fileController = (req:Request, res:Response) => {
  
}