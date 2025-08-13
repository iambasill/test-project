import express from 'express'
import { loginController, registerController, resetPasswordController, verifyEmail} from '../controller/authController'

export const authRoute = express()

authRoute.get('/',()=>{
    return "hello"
})
authRoute.post('/login',loginController)
authRoute.post('/signup',registerController)
// authRoute.post('/send-verification', verifyEmailController)
authRoute.post('/verify-email', verifyEmail)
authRoute.post('/reset-password',resetPasswordController)
// authRoute.post('/verify-account',verifyAccount)
