import express, { Request,Response,NextFunction } from "express"
import { prisma } from "../server"
import { BadRequestError } from "../httpClass/exceptions"
import { signUpSchema } from "../schema/authSchema"
import { AUTH_JWT_TOKEN } from "../../secrets"
import bcrypt from 'bcrypt'
import jwt  from "jsonwebtoken"


export const registerController = async (req:Request,res:Response,next:NextFunction) => {
    const validatedData = signUpSchema.parse(req.body)
    const {email, firstName,lastName} = validatedData

    const existingUser = await prisma.user.findFirst({
        where:{
            email
        }
    })
    if(existingUser && (existingUser.status === 'verified' || existingUser.status === 'blocked')) {
        throw new BadRequestError('user already exists')
    }

    const user = await prisma.user.create({
        data:{
            email,
            firstName,
            lastName
        }
    })

    res.status(201).send({
    success: true,
    message: "user created succesfully"
        })
    
}

export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await prisma.user.findFirst({
        where: { email }
    })

    if (!user) throw new BadRequestError("Invalid Credentials")

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new BadRequestError("Invalid Credentials")

    const token = jwt.sign({ id: user.id }, AUTH_JWT_TOKEN as string)

    res.status(200).send({
        success: true,
        token: token,
        status: user.role
    })
}