import { authRegisterReq } from "@/types/auth/authRequest";
import { prisma } from "@/config/prismaClient";
import { Interest, User } from "@/prisma/index";

export class UserRepository {
    async createNewUser(payload: authRegisterReq): Promise<User> {
        const user = await prisma.user.create({
            data: payload as User,
        });
        return user;
    }

    async findExistingUser(email: string): Promise<boolean> {
        const user = await prisma.user.findFirst({
            where: { email: email },
        });
        return user != null;
    }

    async retrieveUser(
        _email: string,
        without_sentitive_fields: boolean = false
    ): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: { email: _email },
            omit: {
                password: without_sentitive_fields,
                user_id: without_sentitive_fields,
                sex: without_sentitive_fields,
                social_credit: without_sentitive_fields,
                phone: without_sentitive_fields,
                birth_date: without_sentitive_fields,
            },
        });
        return user;
    }

    async getUserInterestsByEmail(email: string): Promise<Interest[]> {
        const user = await prisma.user.findFirst({
            where: { email },
            select: { interests: true },
        });
        return user?.interests || [];
    }

    async updateUserInterestsByEmail(
        email: string,
        interests: Interest[]
    ): Promise<User> {
        return await prisma.user.update({
            where: { email },
            data: { interests },
        });
    }
}
