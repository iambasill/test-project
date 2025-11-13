import jwt from "jsonwebtoken";
import { BadRequestError, unAuthorizedError } from "../logger/exceptions";
import sanitiseHtml from "sanitize-html";
import { config } from "../config";
import { prismaclient } from "../lib/prisma-connect";

export async function checkUser(id: string) {
  const user = await prismaclient.user.findUnique({
    where: { id },
    select: {
      id: true,
      role: true,
      status: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  });
  return user;
}

export const generateToken = async (userId: string) => {
  const token = jwt.sign(
    { id: userId },
    config.AUTH_JWT_RESET_TOKEN as string,
    { expiresIn: "24h" }
  );

  await prismaclient.user.update({
    where: { id: userId },
    data: {
      resetToken: token,
      resetTokenExpiry: new Date(Date.now() + 86400000), // 24 hours
    },
  });

  return token;
};

export const generateLoginToken = async(userId: string, expiresIn: any) => {
  return jwt.sign(
    { id: userId },
    config.AUTH_JWT_TOKEN as string,
    { expiresIn: expiresIn }
  );
};

export const generateUserSession = async (
  userId: string,
  refreshToken: string
) => {
  await prismaclient.$transaction(async (tx) => {
    // Close all active sessions
    await tx.user_sessions.updateMany({
      where: {
        user_id: userId,
        logout_time: null,
      },
      data: { logout_time: new Date() },
    });

    // Store new user session
    await tx.user_sessions.create({
      data: {
        user_id: userId,
        refreshToken,
      },
    });

    // Update last login
    await tx.user.update({
      where: { id: userId },
      data: {
        lastLogin: new Date(),
        isActive: true,
      },
    });
  });
};

export const manageAdminSession = async (userId: string) => {
  // Check if there's already an active admin session from a different admin
  const existingSession = await prismaclient.active_admin_sessions.findFirst({
    where: {
      admin_id: { not: userId },
      logout_time: {
        gt: new Date(), // Still active
      },
      user: {
        status: "ACTIVE",
      },
    },
  });

  if (existingSession) {
    throw new BadRequestError(
      "Another admin is currently active. You cannot log in until their session ends"
    );
  }

  await prismaclient.active_admin_sessions.deleteMany({
    where: {
      admin_id: { not: userId },
    },
  });

  // 4 hours from now
  const logoutAt = new Date(Date.now() + 4 * 60 * 60 * 1000);

  await prismaclient.active_admin_sessions.upsert({
    where: {
      admin_id: userId,
    },
    update: {
      login_time: new Date(),
      logout_time: logoutAt,
    },
    create: {
      admin_id: userId,
      login_time: new Date(),
      logout_time: logoutAt,
    },
  });

  return "4hrs";
};

export function genrateRandomPassword() {
  const timestamp = Date.now().toString(36).toString();
  return timestamp + Math.random().toString(36).substring(2, 5);
}

export async function verifyToken(token: string, type: string) {
  if (!process.env.AUTH_JWT_TOKEN)
    throw new unAuthorizedError("JWT SECRET TOKEN UNDEFINED!");
  if (!process.env.AUTH_RESET_TOKEN)
    throw new unAuthorizedError("JWT SECRET TOKEN UNDEFINED!");

  let secret: string;
  if (type === "auth") {
    secret = config.AUTH_JWT_TOKEN as string;
  } else {
    secret = config.AUTH_JWT_RESET_TOKEN as string;
  }

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    return decoded;
  } catch (err) {
    throw new unAuthorizedError("INVALID OR EXPIRED TOKEN");
  }
}

export  function sanitizeInput(input: Record<string, any> | string): any {
  if (typeof input === "string") {
    return sanitiseHtml(input, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  const sanitized: Record<string, any> = {};
  Object.keys(input).forEach((key) => {
    sanitized[key] = sanitiseHtml(input[key], {
      allowedTags: [],
      allowedAttributes: {},
    });
  });
  return sanitized;
}

// Optional: file upload helper (kept commented)
/*
export const handleFileUploads = async (
  files: any,
  keyValue: string,
  keyId: string
): Promise<void> => {
  const uploadedFiles = Object.values(files).flat();

  if (!uploadedFiles || uploadedFiles.length === 0) return;

  const structuredFiles = getFileUrls(
    uploadedFiles as Express.Multer.File[],
    keyId,
    keyValue
  );

  await prismaclient.document.createMany({
    data: structuredFiles.map((file) => ({
      fileName: file.fileName,
      fileUrl: file.fileUrl,
      keyId: file.keyId,
      keyValue: file.keyValue,
      fileType: file.fileType || "unknown",
      fileSize: file.fileSize || 0,
    })),
  });
};
*/
