import { authRegisterReq } from "@/types/auth/authRequest";
import { prisma } from "@/config/prismaClient";
import { Interest, User } from "@/prisma/index";

export class GroupRepository {
    async createNewGroup(payload: authRegisterReq): Promise<User> {
        const user = await prisma.user.create({
            data: payload as User,
        });
        return user;
    }
}
