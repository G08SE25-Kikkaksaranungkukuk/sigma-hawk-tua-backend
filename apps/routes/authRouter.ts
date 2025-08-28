import {Router} from "express";
import {authRegister} from "../services/auth/authService";

export const authRouter : Router = Router();

authRouter.post("/register",authRegister);