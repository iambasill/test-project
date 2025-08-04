import express from 'express'
import { loginController, registerController} from '../controller/authController'

export const authRoute = express()

authRoute.get('/',()=>{
    return "hello"
})
authRoute.post('/login',loginController)
authRoute.post('/signup',registerController)
// authRoute.post('/send-verification', verifyEmailController)
// authRoute.post('/verify-email', verifyCode)
// authRoute.post('/reset-password',resetPassword)
// authRoute.post('/verify-account',verifyAccount)
