import {Router} from "express";
import {authAuthenticate, authRefresh, authRegister} from "../services/auth/authService";

export const authRouter : Router = Router();

authRouter.post("/register",authRegister);
authRouter.post("/login",authAuthenticate);
authRouter.post("/refresh",authRefresh)