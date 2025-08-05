import express from "express";
import { authRoute } from "./authRouth";
import { userRoute } from "./userRoute";


export const rootRoute = express()

rootRoute.use('/api/auth',authRoute)
rootRoute.use('/api/auth/users/',userRoute)



