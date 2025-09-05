import * as jwt from "jsonwebtoken";
import { config } from "@/config/config";

export const verifyJwt = (token: string, secret: string): any => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const signJwt = (payload: object, secret: string, options?: jwt.SignOptions): string => {
  return jwt.sign(payload, secret, options);
};
