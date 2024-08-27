import { describe, vi, test, expect, beforeEach, afterEach } from "vitest";
import { UserService } from "./user.service";
import { PrismaClient } from "@prisma/client";

let dbClient: PrismaClient;
const userService = new UserService();

describe('UserService', () => {

    beforeEach( async  () => {
        dbClient = new PrismaClient();
        await dbClient.user.deleteMany({});
    })

    afterEach(async () => {
        await userService.disconnect();
        await dbClient.$disconnect();
    })

    describe('createUser',  () => {
        test('should create a new user', async () => {
            
            const newUser = await userService.createUser("godwintrav@gmail.com", "Godwin");
            expect(newUser).toEqual(expect.objectContaining({
                id: expect.any(String),
                email: 'godwintrav@gmail.com',
                name: 'Godwin'
            }));
        })
    });

    describe('getUser',  () => {
        test('should get a user', async () => {
            
            const newUser = await userService.createUser("godwintrav@gmail.com", "Godwin");
            const user = await userService.getUser(newUser.id!);
            expect(user).toEqual(expect.objectContaining({
                id: user?.id,
                email: 'godwintrav@gmail.com',
                name: 'Godwin'
            }));
        })
    });
})