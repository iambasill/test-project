import express from "express";
import { authRoute } from "./authRouth";
import { userRoute } from "./userRoute";
import { equipmentRouter } from "./equipmentRoute";


export const rootRoute = express()

rootRoute.use('/api/auth',authRoute)
rootRoute.use('/api/auth/users/',userRoute)
rootRoute.use('/api/equipment',equipmentRouter)




