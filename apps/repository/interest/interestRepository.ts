// import { authRegisterReq } from "@/types/auth/authRequest";
// import { type User } from "../../../generated/prisma";
import { prisma } from "@/config/prismaClient";

export async function updateUserInterests(userId: number, interests: string[]) {
    const user = await prisma.user.update({
        where: { user_id: userId },
        data: { interest: interests },
        select: { interest: true },
    });
    return user.interest;
}

export async function findUserInterests(userId: number) {
    const user = await prisma.user.findUnique({
        where: { user_id: userId },
        select: { interest: true },
    });
    return user?.interest ?? null;
}
