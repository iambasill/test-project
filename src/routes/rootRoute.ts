import express from "express";
import { authRoute } from "./authRouth";
import { userRoute } from "./userRoute";
import { equipmentRouter } from "./equipmentRoute";
import { operatorRouter } from "./operatorRoute";
import { inspectionRouter } from "./inspectionRoute";
import { attachmentController } from "../controller/attachmentController";
import { getApkController } from "../controller/authController";


export const rootRoute = express()

rootRoute.use('/api/auth',authRoute)
rootRoute.use('/api/auth/users',userRoute)
rootRoute.use('/api/equipment',equipmentRouter)
rootRoute.use('/api/operator',operatorRouter)
rootRoute.use('/api/inspection',inspectionRouter)
rootRoute.get('/attachment/:filename',attachmentController)
rootRoute.get('/download/apk', getApkController)








