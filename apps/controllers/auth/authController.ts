import { prisma } from "../../config/prismaClient"
import { authRegisterReq } from "../../types/auth/authRequest"
import { type User } from "../../../generated/prisma"

export const createNewUser =  async (payload : authRegisterReq) => {
    const user = await prisma.user.create({
        data : payload as unknown as User
    })
    return user
}

export const retrieveUser = async (_email : string) => {
    const user = await prisma.user.findFirst({
        where : {email : _email}
    })
    return user
}