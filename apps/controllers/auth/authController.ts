import { prisma } from "../../config/prismaClient"
import { authRegisterReq } from "../../types/auth/authRequest"
import { type User } from "../../../generated/prisma"

export const createNewUser =  async (payload : authRegisterReq) => {
    const user = await prisma.user.create({
        data : payload as unknown as User
    })
    return user
}

export const retrieveUser = async (_email : string , without_sentitive_fields : boolean = false) => {
    const user = await prisma.user.findFirst({
        where : {email : _email},
        omit : {
            password : without_sentitive_fields,
            salt : without_sentitive_fields,
            user_id : without_sentitive_fields,
            sex : without_sentitive_fields,
            social_credit : without_sentitive_fields,
            phone : without_sentitive_fields,
            birth_date : without_sentitive_fields
        }
    })
    return user
}