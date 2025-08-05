import { prisma } from './../server';


export function checkUser(email:string){
    const user = prisma.user.findUnique({
        where:{email},
    })
return user
}