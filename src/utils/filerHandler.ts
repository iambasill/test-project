import { PrismaClient } from '../generated/prisma';

import { config } from "../config/envConfig";

const prisma = new PrismaClient();

// Optimized helper function to handle file uploads
export async function handleFileUploads(files: any, inspectionId: string) {
    try {
        if (!files || Object.keys(files).length === 0) return;

        const fileEntries = Object.entries(files);
        const fileData = fileEntries.map(([fileName, fileArray]) => {
            const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;
            return {
                fileName,
                fileUrl: `${config.API_BASE_URL}/attachment/${file.filename}`,
                fileType: file.mimetype,
                fileSize: file.size,
                inspectionId
            };
        });

        await prisma.document.createMany({
            data: fileData,
            skipDuplicates: true
        });

        console.log(`Successfully uploaded ${fileData.length} files for inspection ${inspectionId}`);
    } catch (error) {
        console.error('File upload error:', error);
        throw error;
    }
}