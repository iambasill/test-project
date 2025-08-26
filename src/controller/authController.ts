import express, { Request, Response, NextFunction } from "express";
import { prisma } from "../server";
import { BadRequestError, unAuthorizedError } from "../httpClass/exceptions";
import { signUpSchema, loginSchema } from "../schema/schema";
import { API_BASE_URL, AUTH_JWT_TOKEN, CLIENT_URL } from "../../secrets";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from "jsonwebtoken";
import { checkUser } from "../utils/func";
import { sendVerificationEmail } from "../config/emailService";

const generateToken = async (userId: string) => {
  const token = jwt.sign({ id: userId }, AUTH_JWT_TOKEN as string, {expiresIn:'24h'});

  await prisma.user.update({
    where: { id: userId },
    data: { resetToken: token, resetTokenExpiry: new Date(Date.now() + 86400000) }
  });

  return token;
};

const generateLoginToken = (userId: string, expiresIn: any ) => {
  return jwt.sign({ id: userId }, AUTH_JWT_TOKEN as string, { expiresIn:expiresIn });
};

// Helper function to create user session token
const generateUserSession = async (userId: string,session_token:string) => {
  // close all active sessions
   await prisma.user_sessions.updateMany({
    where: {
      user_id: userId,
      logout_time: null,
    },
    data: { logout_time: new Date() }
  });

  // Store user session
  await prisma.user_sessions.create({
    data: {
      user_id: userId,
      session_token
    }
  });

    // Update last login
    await prisma.user.update({
    where: { id: userId },
    data: { 
      lastLogin: new Date(),
      isActive: true
     }
  });
  
};

const manageAdminSession = async (userId: string) => {
  // Check if there's already an active admin session from a different admin
  const existingSession = await prisma.active_admin_sessions.findFirst({
    where: {
      admin_id: { not: userId }, 
      logout_time: {
        gt: new Date() // Still active
      }
    }
  });

  if (existingSession) {
    throw new BadRequestError("Another admin is currently active. You cannot log in until their session ends");
  }

  const logoutAt = new Date(Date.now() + 2 * 60 * 60 * 1000); 
  
  // Use upsert for cleaner code (since admin_id is unique)
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

  return session.logout_time;
};

// ====================== CONTROLLERS ====================== //

/**
 * Register a new user.
 */
export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = signUpSchema.parse(req.body);
  const { email, firstName, lastName, role } = validatedData;

  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) {
    throw new BadRequestError('User already exists');
  }

  const hashedPassword = await bcrypt.hash("password", 12); //create a random function for this
  const user = await prisma.user.create({
    data: { email, firstName, lastName, role, password: hashedPassword, status: 'PENDING', refreshToken: "null" }
  });

  const verificationToken = await generateToken(user.id);
  const verificationLink = `${API_BASE_URL}/download/apk?token=${verificationToken}`;

  // Send verification email
  const emailSent = await sendVerificationEmail(
    email,
    verificationLink,
    firstName,
    "register"
  );

  res.status(201).send({
    success: true,
    message: "User created successfully. Please verify your email.",
  });
};

/**
 * Login user - handles both regular users and admin session management
 */
export const loginController = async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) throw new BadRequestError("Invalid Credentials");
  if (user.status === 'SUSPENDED') throw new BadRequestError("Account Suspended");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new BadRequestError("Invalid Credentials");

let tokenExpiry: Date | null = null;

// Generate user session for all users
if (user.role && ['ADMIN'].includes(user.role)) {
  tokenExpiry = await manageAdminSession(user.id);
}

const expiresIn =
  tokenExpiry && tokenExpiry instanceof Date
    ? `${Math.floor((tokenExpiry.getTime() - Date.now()) / 1000)}s`
    : "8h";

const token = generateLoginToken(user.id, expiresIn);

await generateUserSession(user.id,token);

  const { password: _, ...userData } = user;



  res.status(200).send({
    success: true,
    token,
    user
  });
};

/**
 * Logout controller - clears user session and admin session if applicable
 */
export const logoutController = async (req: Request, res: Response) => {
  const user:any = req.user
  const token:any = req.token

  
  // Clear user session
  await prisma.user_sessions.updateMany({
    where: { 
      user_id: user.id,
      session_token:token
    },
    data:{logout_time: new Date()}
  });

  // If user is admin and has admin session, clear it
  if (user.role && ['ADMIN'].includes(user.role)) {
    const result = await prisma.active_admin_sessions.updateMany({
      where: { admin_id: user.id },
      data: { logout_time: new Date() }
    });
  }

    await prisma.user.update({
    where:{id:user.id},
    data:{
      isActive:false
    }
   })
   

  res.status(200).send({
    success: true,
    message: "Logged out successfully",
  });
};

/**
 * Check admin status - returns current admin session info
 */
export const getAdminStatusController = async (req: Request, res: Response) => {
  const activeSession = await prisma.active_admin_sessions.findFirst({
    
    where: { // TODO:  revert after development
    },
    include:{
      user:{
        select:{
          firstName:true,
          lastName:true,
          email: true,
          lastLogin:true
        }
      }
    }

  });

  if (!activeSession) {
    return res.status(200).send({
      success: true,
      message: "No admin currently active"
    });
  }

  res.status(200).send({
    success: true,
    adminActive: true,
    loginTime: activeSession

  });
};

/**
 * Force terminate admin session - Emergency override for PLATADMIN
 */
export const forceTerminateAdminController = async (req: Request, res: Response) => {

  const { userId } = req.body;

  // Terminate target admin session
  const result = await prisma.active_admin_sessions.updateMany({
    where: { 
      admin_id: userId 
    },
    data: { logout_time: new Date() }
  });

   await prisma.user.updateMany({
    where:{id:userId},
    data:{
      isActive:false
    }
   })

   await prisma.active_admin_sessions.deleteMany({
    where:{admin_id:userId}
   })

  res.status(200).send({
    success: true,
  });
};

export const changePasswordController = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() }
    }
  });

  if (!user) throw new BadRequestError("Invalid or expired token");

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null, status: "ACTIVE" }
  });

  res.status(200).send({ success: true, message: "Password changed successful" });
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email
    }
  });

  if (!user) throw new BadRequestError("Email is incorrect!");

  const verificationToken = await generateToken(user.id);
  const verificationLink = `${CLIENT_URL}/reset/change-password?token=${verificationToken}`;

  // Send verification email
  const emailSent = await sendVerificationEmail(
    email,
    verificationLink,
    user.firstName,
    "reset"
  );

  res.status(200).send({ success: true, message: "Verification link sent to email successful" });
};

export const verifyTokenController = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Token verified successfully!',
  });
};

export const getApkController = async (req: Request, res: Response) => {
  const token = req.query.token;

  if (token) {
    res.redirect("https://expo.dev/artifacts/eas/2Vt9L1cbzTLmdSNHJpQvuf.apk");
  } else {
    res.status(401).send("Invalid token");
  }
};

export const verifyUserController = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findFirst({
    where: { email }
  });

  if (!user) throw new BadRequestError("User does not exist!");

  const token = await generateToken(user.id);

  res.status(200).json({
    success: "true",
    UserStatus: user.status,
    token: token
  });
};

export const resendVerficationController = async (req: Request, res: Response, next: NextFunction) => {
  const {email} = req.body

  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (!existingUser) {
    throw new BadRequestError('User does not exists');
  }

  const verificationToken = await generateToken(existingUser.id);
  const verificationLink = `${API_BASE_URL}/download/apk?token=${verificationToken}`;

  // Send verification email
  const emailSent = await sendVerificationEmail(
    email,
    verificationLink,
    existingUser.firstName,
    "register"
  );

  res.status(200).send({
    success: true,
    message: "User verified successfully. Please check your email.",
  });
};