import express from "express";
import { authRoute } from "./authRouth";


export const rootRoute = express()

// rootRoute.use('/')

rootRoute.use('/api/auth/',authRoute)



