import express, { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../httpClass/exceptions";
import { signUpSchema, loginSchema, emailSchema, changePasswordSchema, userIdSchema, tokenSchema } from "../schema/schema";
import bcrypt from 'bcrypt';
import { checkUser, generateLoginToken, generateToken, generateUserSession, genrateRandomPassword, manageAdminSession, verifyToken } from "../utils/helperFunction";
import { sendVerificationEmail } from "../services/emailService";
import { config } from "../config/envConfig";
import { prismaclient } from "../lib/prisma-connect";



const prisma = prismaclient


// ====================== CONTROLLERS ====================== //

/**
 * Register a new user.
 */
export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  const { email, firstName, lastName, role }  = signUpSchema.parse(req.body);
  
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) {
    throw new BadRequestError('User already exists');
  }
  const hashedPassword = await bcrypt.hash( await genrateRandomPassword(), 12); 
  const user:any = await prisma.user.create({
    data: { email, firstName, lastName, role, password: hashedPassword, refreshToken: null }
  });

  const verificationToken = await generateToken(user.id);
  const verificationLink = `${config.API_BASE_URL}/download/apk?token=${verificationToken}`;
    // Send verification email
    await sendVerificationEmail(
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
  if (user.status === 'SUSPENDED') throw new BadRequestError("Account suspended please contact the Admin");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new BadRequestError("Invalid Credentials");

  let tokenExpiry: String | null = null;

// Generate user session 
  if (user.role && ['ADMIN'].includes(user.role)) tokenExpiry = await manageAdminSession(user.id);

const expiresIn =
  tokenExpiry && tokenExpiry instanceof Date
    ? `${Math.floor((tokenExpiry.getTime() - Date.now()) / 1000)}s`
    : "15m";

const token = await generateLoginToken(user.id, expiresIn);

  const refreshToken =  await generateLoginToken(user.id, "8h")

  await generateUserSession(user.id,token, refreshToken);

  // const { password: _,updatedAt, resetTokenExpiry, ...userData } = user;


  res.status(200).send({
    success: true,
    token,
    refreshToken,
    userData : {
      role : user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      lastLogin: user.lastLogin
    },
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

  // If user is admin and has admin session
  if (user.role && ['ADMIN'].includes(user.role)) {
  
     await prisma.active_admin_sessions.deleteMany({
     where:{admin_id:user.id}
   })
 
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
  const activeSession = await prisma.active_admin_sessions.findMany({
    where: { 
      user: {
        status: "ACTIVE"
      }
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
      message: "No admin is currently active"
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
  const { userId } = userIdSchema.parse(req.body);

  const user = checkUser(userId as string)
  if (!user) throw new BadRequestError("Invalid User")

  await prisma.user_sessions.updateMany({
    where: { 
      user_id: userId,
      logout_time:null
    },
    data:{logout_time: new Date()}
  });
  // Terminate target admin session
  await prisma.active_admin_sessions.deleteMany({
     where:{admin_id:userId}
   })

   await prisma.user.update({
    where:{id:userId},
    data:{
      isActive:false
    }
   })

  res.status(200).send({
    success: true,
  });
};

/**
 * Change password
 */

export const changePasswordController = async (req: Request, res: Response) => {

  const { token, newPassword } = changePasswordSchema.parse(req.body);
  
  await verifyToken(token as string,"reset")
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() }
    }
  });

  if (!user) throw new BadRequestError("Invalid or expired token");

  const hashedPassword = await bcrypt.hash(newPassword as string, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null, status: "ACTIVE" }
  });

  res.status(200).send({ success: true, message: "Password changed successful" });
};

/**
 * forgot Password controller 
 */

export const forgotPasswordController = async (req: Request, res: Response) => {
  const {email} = emailSchema.parse(req.body)

  const user = await prisma.user.findFirst({
    where: {
      email
    }
  });

  if (!user) throw new BadRequestError("Email is incorrect!");

  const verificationToken = await generateToken(user.id);
  const verificationLink = `${config.CLIENT_URL}/reset/change-password?token=${verificationToken}`;

  // Send verification email
  await sendVerificationEmail(
    email,
    verificationLink,
    user.firstName,
    "reset"
  );

  res.status(200).send({ success: true, message: "Verification link sent to email successful" });
};

/**
 * verify session controller 
 */

export const verifySessionTokenController = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Token verified successfully!',
  });
};

/**
 * getAPK controller 
 */

export const getApkController = async (req: Request, res: Response) => {
  const token = (req.query.token)?.toString();
  if (token) {
    await verifyToken(token,"reset")
    res.redirect("https://github.com/404-services01/Defence-IVM-Mobile/releases/download/v1.0.0/DefenceApp.apk")
  } else {
    res.status(401).send("Invalid token");
  }
};


/**
 * Verify User controller 
 */


export const verifyUserController = async (req: Request, res: Response) => {
  const {email} = emailSchema.parse(req.body)

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

/**
 * resend verification controller 
 */


export const resendVerficationController = async (req: Request, res: Response, next: NextFunction) => {
  const {email} = emailSchema.parse(req.body)

  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (!existingUser) {
    throw new BadRequestError('User does not exists');
  }

  const verificationToken = await generateToken(existingUser.id);
  const verificationLink = `${config.API_BASE_URL}/download/apk?token=${verificationToken}`;

  // Send verification email
    await sendVerificationEmail(
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


/**
 * refresh token controller 
 */

export const refreshToken = async (req:Request, res:Response) => {
  const user:any = req.user
  const {refreshToken} = tokenSchema.parse(req.body)

  const valid = await prisma.user_sessions.findFirst({
    where:{
      refreshToken,
      user_id: user.id,
    }
  })
  if (!valid) throw new BadRequestError("Invalid refresh token")
  
  const decoded = await verifyToken(refreshToken,"auth")

  await checkUser(decoded.id)
  let tokenExpiry: String | null = null;

  if (user.role && ['ADMIN'].includes(user.role))  await manageAdminSession(user.id);

  const token = await generateLoginToken(user.id, "30m");
  const newrefreshToken =  await generateLoginToken(user.id, "8h")

  await generateUserSession(user.id,token,newrefreshToken);

   res.status(200).send({
    success: true,
    token,
    refreshToken: newrefreshToken,
  });

}