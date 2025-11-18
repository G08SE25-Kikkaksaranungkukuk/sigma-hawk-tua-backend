import { Request, Response } from "express"
import { authRegReqSchema, validateRegisterInput } from "@/utils/RegisterValidation";
import bcrypt from "bcrypt"
import { authRegisterReq } from "@/types/auth/authRequest";
import { userLoginSchema } from "@/utils/LoginValidation";
import * as jwt from "jsonwebtoken";
import { config } from "@/config/config";
import { UserRepository } from "@/repository/User/userRepository";
import { AppError } from "@/types/error/AppError";
import { User } from "@/prisma/wasm";
import { verifyJwt } from "@/utils/jwt";

export class AuthService {
    async isEmailExists(email: string): Promise<boolean> {
        return await this.userRepository.findExistingUser(email);
    }
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async register(req: authRegisterReq) {
        //validate input
        console.log("Registering user with email:", req.email, req.phone, req.password);
        if (validateRegisterInput(req.phone, req.email, req.password).isValid == false) {
            throw new AppError("Validation error", 400);
        }

        //find if user already exists
        const existingUser = await this.userRepository.findExistingUser(req.email);
        if (existingUser) {
            throw new AppError("User with this email already exists", 409);
        }

        // bcrypt automatically generates and includes salt in the hash
        const hashed_password = await bcrypt.hash(req.password, config.PASSWORD_SALT_ROUNDS)
        const processed_body = {
            ...req,
            "password": hashed_password,
            "birth_date": new Date(req.birth_date)
        }
        const user: User = await this.userRepository.createNewUser(processed_body as authRegisterReq);
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;

    }

    // authenticate to get token (Login)
    async login(loginData: any): Promise<{ accessToken: string, refreshToken: string }> {
        const parsed_body = userLoginSchema.parse(loginData);
        const user = await this.userRepository.retrieveUser(parsed_body.email);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        const isAuthenticated = await bcrypt.compare(parsed_body.password, user.password);
        if (!isAuthenticated) {
            throw new AppError("Invalid Password", 401);
        }

        // generate jwt token
        const { password: _, ...user_safe } = user
        const accessToken = jwt.sign(user_safe as Object, config.ACCESSTOKEN_SECRET, {
            expiresIn: 60 * 60 * 24
        })
        const refreshToken = jwt.sign(user_safe as Object, config.REFRESHTOKEN_SECRET, {
            expiresIn: 60 * 60 * 24 * 30
        })

        return { accessToken, refreshToken };
    }

    //refresh user accesstoken and refreshtoken
    async refreshTokens(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
        try {
            const jwt_dat = jwt.verify(refreshToken, config.REFRESHTOKEN_SECRET) as Record<string, any>
            const user_email = jwt_dat.email
            const user_safe = await this.userRepository.retrieveUser(user_email, true)
            const _accessToken = jwt.sign(user_safe as Object, config.ACCESSTOKEN_SECRET, {
                expiresIn: 60 * 60 * 24
            })
            const _refreshToken = jwt.sign(user_safe as Object, config.REFRESHTOKEN_SECRET, {
                expiresIn: 60 * 60 * 24 * 30
            })

            return {
                "accessToken": _accessToken,
                "refreshToken": _refreshToken
            }
        }
        catch (e) {
            throw new AppError("Invalid refresh token", 403);
        }
    }

    async forgotPassword(email: string): Promise<boolean> {
        // TODO: Implement forgot password logic
        // For now, just return true
        return true;
    }

    async whoami(jwt: string): Promise<Partial<User>> {
        const ret = verifyJwt(jwt, config.ACCESSTOKEN_SECRET) as Partial<User>;
        return ret
    }

    async checkEmailExists(email: string): Promise<boolean> {
        const user = await this.userRepository.findExistingUser(email);
        return !!user; // Convert to boolean
    }


}

