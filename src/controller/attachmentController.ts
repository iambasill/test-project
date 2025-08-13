import { Request, Response } from "express";
import path from "path";
import { notFoundError } from "../httpClass/exceptions";

// MIME type mapping object (extension -> content type)
const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
};

export const attachmentController = (req: Request, res: Response) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'storage/document', filename);
    
    // Get file extension and determine Content-Type
    const ext = path.extname(filename).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream'; // Fallback for unknown types
    
    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Send file with error handling
    res.sendFile(imagePath, (err) => {
      if (err) {
        console.error('File send error:', err); //to be removed
        if (!res.headersSent) {
            throw new notFoundError("File not found")
        }
      }
    });
    

};
