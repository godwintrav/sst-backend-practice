import { describe, vi, test, expect, beforeEach, afterEach } from "vitest";
import * as Responses from '@backend-exercise/utils/responses';
import { createUser, getUser } from "./user.controller";
import { ErrorCodes } from "@backend-exercise/utils/responses";
import { PrismaClient } from "@prisma/client";
import { UserService } from "../services/user/user.service";

let dbClient : PrismaClient;


describe('UserController', () => {
    beforeEach(async () => {
        dbClient = new PrismaClient();
        await dbClient.user.deleteMany({});
    });

    afterEach(async () => {
        
        await dbClient.$disconnect();
    })

    describe('createUser Function', () => {

        
    
        test('should return InvalidRequestError with message "Invalid Request Param" if name and email are invalid', async () => {
            
            const invalidRequestErrorSpy = vi.spyOn(Responses, 'InvalidRequestError');
            const response = await createUser('{}');
            // console.log(response);
            expect(response.statusCode).toEqual(422);
            expect(invalidRequestErrorSpy).toBeCalledTimes(1);
            expect(invalidRequestErrorSpy).toBeCalledWith({code: ErrorCodes.MISSING_REQUEST_BODY, message: "Invalid Request Param", service: "user"})
        })
    
        test('should return InvalidRequestError with message "Valid Email required" if email is not valid', async () => {
            
            const invalidRequestErrorSpy = vi.spyOn(Responses, 'InvalidRequestError');
            const response = await createUser('{"name": "godwin", "email": "godwin"}');
            expect(invalidRequestErrorSpy).toBeCalledTimes(1);
            expect(response.statusCode).toEqual(422);
            expect(invalidRequestErrorSpy).toBeCalledWith({code: ErrorCodes.MISSING_REQUEST_BODY, message: "Valid Email required", service: "user"});
        });
    
        test('should return InvalidRequestError with message "Email Already Exists" if user service emailExists function returns true', async () => {
            const disconnectSpy = vi.spyOn(UserService.prototype, 'disconnect');
            const emailExistsSpy = vi.spyOn(UserService.prototype, 'emailExists');
            const invalidRequestErrorSpy = vi.spyOn(Responses, 'InvalidRequestError');
            emailExistsSpy.mockResolvedValueOnce(true);
            const response = await createUser('{"name": "godwin", "email": "godwin35@gmail.com"}');
            expect(response.statusCode).toEqual(422);
            expect(emailExistsSpy).toBeCalledTimes(1);
            expect(emailExistsSpy).toBeCalledWith("godwin35@gmail.com");
            expect(invalidRequestErrorSpy).toBeCalledTimes(1);
            expect(invalidRequestErrorSpy).toBeCalledWith({code: ErrorCodes.MISSING_REQUEST_BODY, message: "Email Already Exists", service: "user"});
           
        })
    
        test('should create a new user and return status code 201', async () => {
            const disconnectSpy = vi.spyOn(UserService.prototype, 'disconnect');
            const createUserSpy = vi.spyOn(UserService.prototype, 'createUser');
            const response = await createUser('{"name": "godwin", "email": "godwin356@gmail.com"}');
            expect(response.statusCode).toEqual(201);
            expect(createUserSpy).toBeCalledTimes(1);
            expect(disconnectSpy).toBeCalledTimes(1);
        });
    
        test('should return ServerError with message "Internal Server Error" if unexpected error occurs', async () => {
            const disconnectSpy = vi.spyOn(UserService.prototype, 'disconnect');
            const createUserSpy = vi.spyOn(UserService.prototype, 'createUser');
            const ServerErrorSpy = vi.spyOn(Responses, 'ServerError');
            createUserSpy.mockRejectedValueOnce("error");
            const response = await createUser('{"name": "godwin", "email": "godwin356@gmail.com"}');
            expect(response.statusCode).toEqual(500);
            expect(createUserSpy).toBeCalledTimes(1);
            expect(ServerErrorSpy).toBeCalledTimes(1);
            expect(ServerErrorSpy).toBeCalledWith({code: ErrorCodes.DATA_PROVISION_ERROR, message: "Internal Server Error", service: "user"});
            expect(disconnectSpy).toBeCalledTimes(1);
        })
    });

    describe('getUser Controller', () => {

        test('should return user found', async () => {
            const newUser = await dbClient.user.create({
                data: {
                  name: "Godwin",
                  email: "Odenigbo"
                },
              });

            const response = await getUser(newUser.id);
            expect(response).toEqual(expect.objectContaining({
                statusCode: 200,
                body: JSON.stringify({
                    user: newUser
                })
            }));  
        })

        test('should return 404 if no user found', async () => {
            const response = await getUser("fakeId");
            expect(response).toEqual(expect.objectContaining({
                statusCode: 404,
                body: JSON.stringify({
                    message: "No User Found"
                })
            })); 
        })

        test('should return error if unexpected error occurs', async () => {
            const getUserSpy = vi.spyOn(UserService.prototype, 'getUser');
            getUserSpy.mockRejectedValueOnce("error");
            const response = await getUser("fakeId");
            expect(response.statusCode).toEqual(500);
        })
    })
})

