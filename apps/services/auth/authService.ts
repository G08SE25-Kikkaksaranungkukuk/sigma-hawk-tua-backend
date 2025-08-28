import {Request , Response} from "express"
import { authRegReqSchema, validateRegisterInput } from "../../utils/RegisterValidation";
import { createNewUser } from "../../controllers/auth/authController";
import bcrypt from "bcrypt"
import { authRegisterReq } from "../../types/auth/authRequest";
// register user to the system
export const authRegister = async (req : Request , res : Response) => {
    try {
        const parsed_body = authRegReqSchema.parse(req.body);
        const {isValid} = validateRegisterInput(parsed_body.phone,parsed_body.email,parsed_body.password);
        if(!isValid) throw "Validation error";
        const salt = await bcrypt.genSalt(Number((process.env.PASSWORD_SALT_ROUNDS as number|undefined)) ?? 12)
        const hashed_password = await bcrypt.hash(parsed_body.password,salt)
        const processed_body = {
            ...parsed_body,
            "password" : hashed_password,
            "salt" : salt,
            "birth_date" : new Date(parsed_body.birth_date)
        }
        await createNewUser(processed_body as unknown as authRegisterReq)
        return res.sendStatus(200)
    }
    catch(e) {
        console.error(e) // debug
        return res.sendStatus(400); // bad request
    }
};

// authenticate to get token
export const authAuthenticate = (req : Request , res : Response) => {

};

// refresh user accesstoken and refreshtoken
export const authRefresh = (req : Request , res : Response) => {

};

// log the user out of the system
export const authLogout = (req : Request , res : Response) => {

};