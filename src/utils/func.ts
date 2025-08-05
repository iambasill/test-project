import { prisma } from './../server';


export function checkUser(id:string){
    const user = prisma.user.findUnique({
        where:{id},
    })
return user
}