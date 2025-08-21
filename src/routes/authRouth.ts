import express from 'express'
import { loginController, registerController, changePasswordController, verifyTokenController, verifyUserController} from '../controller/authController'

export const authRoute = express()

authRoute.get('/',()=>{
    return "hello"
})
authRoute.post('/login',loginController)
authRoute.post('/signup',registerController)
authRoute.post('/verify-user',verifyUserController )

// authRoute.post('/send-verification', verifyEmailController)
authRoute.post('/verify-token', verifyTokenController)
authRoute.post('/change-password',changePasswordController)

// authRoute.post('/verify-account',verifyAccount)
