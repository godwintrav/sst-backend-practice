import { PrismaClient } from "@prisma/client";
import { UserModel } from "services/user/user.model";

export class UserService{
    private db: PrismaClient;
    
    constructor() {
       this.db = new PrismaClient();
    }

    public async createUser(email: string, name: string): Promise<UserModel>{
        const newUser = await this.db.user.create({
            data: {
              name: name,
              email: email
            },
          });

          return newUser;
    }

    public async emailExists(email: string): Promise<boolean> {
        const user = await  this.db.user.findUnique({
            where: {
                email
            }
        });

        if(user != undefined){
            return true;
        }

        return false;
    }

    public async getUser(id: string): Promise<UserModel | null> {
        const user = await this.db.user.findUnique({
            where: {
                id
            }
        })
        return user;
    }

    public async getUsers(): Promise<UserModel[] | null> {
        const users = await this.db.user.findMany();
        return users;
    }

    public async updateUser(id: string, updatedUser: UserModel): Promise<UserModel | null> {
        const user = await this.db.user.update({
            where: {id},
            data: {
                email: updatedUser.email,
                name: updatedUser.name
            }
        })
        return user;
    }

    public async deleteUser(id: string): Promise<void> {
        await this.db.user.delete({
            where: {
                id
            }
        })
    }
    public async disconnect(): Promise<void> {
        await this.db.$disconnect();
    }

    
}