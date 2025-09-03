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

    async getUserProfile(email: string): Promise<Partial<User> | null> {
        const user = await prisma.user.findFirst({
            where: { email: email },
            select: {
                first_name: true,
                middle_name: true,
                last_name: true,
                birth_date: true,
                sex: true,
                phone: true,
                profile_url: true,
                social_credit: true,
                interests: true,
                travel_styles: true,
            },
        });
        return user;
    }

    async updateUser(email: string, data: Partial<User>): Promise<User> {
        const updatedUser = await prisma.user.update({
            where: { email },
            data,
        });
        return updatedUser;
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
        const updatedUser = await prisma.user.update({
            where: { email },
            data: { interests },
        });
        return updatedUser;
    }
}
