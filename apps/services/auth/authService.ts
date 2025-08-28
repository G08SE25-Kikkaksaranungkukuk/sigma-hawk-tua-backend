import {Request , Response} from "express"
import { authRegReqSchema, validateRegisterInput } from "../../utils/RegisterValidation";
import { createNewUser, retrieveUser } from "../../controllers/auth/authController";
import bcrypt from "bcrypt"
import { authRegisterReq } from "../../types/auth/authRequest";
import { userLoginSchema } from "../../utils/LoginValidation";
import * as jwt from "jsonwebtoken";


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
        // console.error(e) // debug
        return res.sendStatus(400); // bad request
    }
};

// authenticate to get token
export const authAuthenticate = async (req : Request , res : Response) => {
    try {
        const parsed_body = userLoginSchema.parse(req.body);
        const password = parsed_body.password;
        const user = await retrieveUser(parsed_body.email);
        const salt = user?.salt ?? "";
        const isAuthenticated = (await bcrypt.hash(password,salt)) == (user?.password);
        if(!isAuthenticated) throw "Not authenticated";
        const user_safe = await retrieveUser(parsed_body.email,true);
        const accessToken = jwt.sign(user_safe as Object,process.env.ACCESSTOKEN_SECRET as string,{
            expiresIn : 60 * 60 * 24
        })
        const refreshToken = jwt.sign(user_safe as Object,process.env.REFRESHTOKEN_SECRET as string,{
            expiresIn : 60 * 60 * 24 * 30
        })
        res.cookie("accessToken",accessToken,{
            maxAge : 60 * 60 * 24
        })
        res.cookie("refreshToken",refreshToken,{
            maxAge : 60 * 60 * 24 * 30
        })
        return res.json({
            accessToken,refreshToken
        })
    }
    catch(e) {
        // console.error(e) // debug
        return res.sendStatus(403); // unauthorized
    }
};

// refresh user accesstoken and refreshtoken
export const authRefresh = async (req : Request , res : Response) => {
    try {
        const {refreshToken, accessToken} = req.cookies
        const jwt_dat = jwt.verify(refreshToken,process.env.REFRESHTOKEN_SECRET as string) as Record<string,any>
        const user_email = jwt_dat.email
        const user_safe = await retrieveUser(user_email,true)
        const _accessToken = jwt.sign( user_safe as Object,process.env.ACCESSTOKEN_SECRET as string,{
            expiresIn : 60 * 60 * 24
        })
        const _refreshToken = jwt.sign(user_safe as Object,process.env.REFRESHTOKEN_SECRET as string,{
            expiresIn : 60 * 60 * 24 * 30
        })
        res.cookie("accessToken",_accessToken,{
            maxAge : 60 * 60 * 24
        })
        res.cookie("refreshToken",_refreshToken,{
            maxAge : 60 * 60 * 24 * 30
        })
        return res.json({
            "accessToken" : _accessToken,
            "refreshToken" : _refreshToken
        })
    }
    catch(e) {
        // console.error(e) // debug
        return res.sendStatus(403); // unauthorized
    }
};