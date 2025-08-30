import * as repo from "../repositories/interestRepository";

export async function setUserInterests(userId: number, interests: string[]) {
    return repo.updateUserInterests(userId, interests);
}

export async function getUserInterests(userId: number) {
    return repo.findUserInterests(userId);
}

export async function clearUserInterests(userId: number) {
    return repo.updateUserInterests(userId, []);
}
