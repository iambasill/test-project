
import jwt from "jsonwebtoken"
import { BadRequestError, unAuthorizedError } from "../httpClass/exceptions";
import sanitiseHtml from "sanitize-html";
import { config } from "../config/envConfig";
import { prismaclient } from "../lib/prisma-connect";

const prisma = prismaclient


export async function checkUser(id:string){
    const user = prisma.user.findUnique({
        where:{id},
    })
return user
}

export const generateToken = async (userId: string) => {
  const token = jwt.sign({ id: userId }, config.AUTH_RESET_TOKEN as string, {expiresIn:'24h'});

  await prisma.user.update({
    where: { id: userId },
    data: { resetToken: token, resetTokenExpiry: new Date(Date.now() + 86400000) }
  });

  return token;
};

export const generateLoginToken = async (userId: string, expiresIn: any ) => {
  return jwt.sign({ id: userId }, config.AUTH_JWT_TOKEN as string, { expiresIn:expiresIn });
};

export const generateUserSession = async (userId: string,session_token:string,refreshToken:string) => {
    await prisma.$transaction(async (tx) => {
    // close all active sessions
      tx.user_sessions.updateMany({
       where: {
      user_id: userId,
      logout_time: null,
    },
    data: { logout_time: new Date() }
  });



  // Store user session
    tx.user_sessions.create({
    data: {
      user_id: userId,
      session_token,
      refreshToken
    }
  });

    // Update last login
    tx.user.update({
    where: { id: userId },
    data: { 
      lastLogin: new Date(),
      isActive: true
     }
  });

    })

  
};

export const manageAdminSession = async (userId: string) => {
  // Check if there's already an active admin session from a different admin
  const existingSession = await prisma.active_admin_sessions.findFirst({
    where: {
      admin_id: { not: userId }, 
      logout_time: {
        gt: new Date() // Still active
      },
      user:{
        status: "ACTIVE"
      }
    }
  });

  if (existingSession) {
    throw new BadRequestError("Another admin is currently active. You cannot log in until their session ends");
  }

    await prisma.active_admin_sessions.deleteMany({
     where:{
      admin_id:{not:userId}
     }
   })
 
   // 2hours from now
  const logoutAt = new Date(Date.now() + 15 * 60 * 1000); 
  
  const session = await prisma.active_admin_sessions.upsert({
    where: { 
      admin_id: userId // Use the unique field for lookup
    },
    update: { 
      login_time: new Date(), 
      logout_time: logoutAt 
    },
    create: { 
      admin_id: userId, 
      login_time: new Date(), 
      logout_time: logoutAt 
    }
  });

  return "15m";

};

export async function genrateRandomPassword()  {
    const timestamp = Date.now().toString(36).toString()
    return timestamp + Math.random().toString(36).substring(2,5)
}


export async function verifyToken(token: string, type: string) {
    if (!process.env.AUTH_JWT_TOKEN) throw new unAuthorizedError('JWT SECRET TOKEN UNDEFINED!');
    if (!process.env.AUTH_RESET_TOKEN) throw new unAuthorizedError('JWT SECRET TOKEN UNDEFINED!');

    let secret: string;
    if (type === "auth") {
        secret = config.AUTH_JWT_TOKEN as string;
    } else {
        secret = config.AUTH_RESET_TOKEN as string;
    }

    try {
        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
        return decoded;
    } catch (err) {
        throw new unAuthorizedError("INVALID OR EXPIRED TOKEN");
    }
}


export function sanitizeInput(input: Record<string, any> | string): any {
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
