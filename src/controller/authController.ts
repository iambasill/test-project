import express, { Request, Response, NextFunction } from "express";
import { prisma } from "../server";
import { BadRequestError } from "../httpClass/exceptions";
import { signUpSchema, loginSchema } from "../schema/schema";
import { AUTH_JWT_TOKEN } from "../../secrets";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
// import { sendPasswordResetEmail } from "../utils/emailService";

const generateToken = (userId: string) => {
  // return jwt.sign({ id: userId }, AUTH_JWT_TOKEN as string, { expiresIn: '6h' });
  return jwt.sign({ id: userId }, AUTH_JWT_TOKEN as string);

};

// const generateRefreshToken = (userId: string) => {
//   return jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' });
// };

// ====================== CONTROLLERS ====================== //

/**
 * Register a new user.
 */

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = signUpSchema.parse(req.body);
  const { email, firstName, lastName, role } = validatedData;

  const existingUser = await prisma.user.findFirst({ where: { email } });
//   if (existingUser && (existingUser.status === 'VERIFIED' || existingUser.status === 'BLOCKED')) {
    if (existingUser ){
    throw new BadRequestError('User already exists');
  }

  const hashedPassword = await bcrypt.hash("password", 12);
  const user = await prisma.user.create({
    data: { email, firstName, lastName, role, password: hashedPassword, status: 'PENDING',refreshToken:"null" }
  });

  // (Optional) Send verification email here.

  res.status(201).send({
    success: true,
    message: "User created successfully. Please verify your email.",
  });
};

/**
 * Login user and return JWT token.
 */
export const loginController = async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) throw new BadRequestError("Invalid Credentials"); 
  if (user.status === 'SUSPENDED') throw new BadRequestError("Account Suspended"); 

  

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new BadRequestError("Invalid Credentials");

  const { password: _, ...userData } = user; 

  const token = generateToken(user.id);
//   const refreshToken = generateRefreshToken(user.id);

  // Store refresh token in database (optional)
//   await prisma.user.update({
//     where: { id: user.id },
//     data: { refreshToken }
//   });

  res.status(200).send({
    success: true,
    token,
    // refreshToken,
    user: userData,
  });
};

/**
 * Refresh access token using refresh token.
 */
// export const refreshTokenController = async (req: Request, res: Response) => {
//   const { refreshToken } = req.body;
//   if (!refreshToken) throw new UnauthorizedError("No refresh token provided");

//   const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string) as { id: string };
//   const user = await prisma.user.findFirst({ where: { id: decoded.id, refreshToken } });

//   if (!user) throw new UnauthorizedError("Invalid refresh token");

//   const newToken = generateToken(user.id);
//   res.status(200).send({ success: true, token: newToken });
// };

/**
 * Change user password (requires old password).
 */
// export const changePasswordController = async (req: Request, res: Response) => {
//   const userId = req.user?.id; // Assuming `req.user` is set by auth middleware
//   const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);

//   const user = await prisma.user.findUnique({ where: { id: userId } });
//   if (!user) throw new BadRequestError("User not found");

//   const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
//   if (!isOldPasswordValid) throw new BadRequestError("Old password is incorrect");

//   const hashedNewPassword = await bcrypt.hash(newPassword, 12);
//   await prisma.user.update({
//     where: { id: userId },
//     data: { password: hashedNewPassword }
//   });

//   res.status(200).send({ success: true, message: "Password updated successfully" });
// };

/**
 * Initiate password reset (sends reset link via email).
 */
// export const forgotPasswordController = async (req: Request, res: Response) => {
//   const { email } = req.body;
//   const user = await prisma.user.findFirst({ where: { email } });
//   if (!user) return res.status(200).send({ success: true }); // Don't reveal if user exists

//   const resetToken = crypto.randomBytes(20).toString('hex');
//   const resetTokenExpiry = new Date(Date.now() + PASSWORD_RESET_EXPIRY);

//   await prisma.user.update({
//     where: { id: user.id },
//     data: { resetToken, resetTokenExpiry }
//   });

//   await sendPasswordResetEmail(email, resetToken); // Implement this in `emailService.ts`

//   res.status(200).send({ success: true, message: "Password reset link sent to email" });
// };

/**
 * Reset password using a valid token.
 */
// export const resetPasswordController = async (req: Request, res: Response) => {
//   const { token, newPassword } = resetPasswordSchema.parse(req.body);

//   const user = await prisma.user.findFirst({
//     where: {
//       resetToken: token,
//       resetTokenExpiry: { gt: new Date() } // Token not expired
//     }
//   });

//   if (!user) throw new BadRequestError("Invalid or expired token");

//   const hashedPassword = await bcrypt.hash(newPassword, 12);
//   await prisma.user.update({
//     where: { id: user.id },
//     data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null }
//   });

//   res.status(200).send({ success: true, message: "Password reset successful" });
// };

/**
 * Logout user (revokes refresh token).
 */
// export const logoutController = async (req: Request, res: Response) => {
//   const userId = req.user?.id;
//   if (!userId) throw new UnauthorizedError("Not authenticated");

//   await prisma.user.update({
//     where: { id: userId },
//     data: { refreshToken: null }
//   });

//   res.status(200).send({ success: true, message: "Logged out successfully" });
// };