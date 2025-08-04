import express from "express";
import { authController } from "../controller/authController";


export const rootRoute = express()

// rootRoute.use('/')

rootRoute.get('/',authController)



