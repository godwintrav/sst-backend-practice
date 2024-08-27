import { ErrorCodes, InvalidRequestError, ServerError } from "@backend-exercise/utils/responses";
import { UserService } from "@backend-exercise/lambda/services/user/user.service";
import { escape, isEmail } from "validator";



export async function createUser(body: string) {
        const userService = new UserService();
        const {name, email} = JSON.parse(body);

        if(!name || !email){
            return InvalidRequestError({code: ErrorCodes.MISSING_REQUEST_BODY, message: "Invalid Request Param", service: "user"});
        }

        if(!isEmail(email)){
            return InvalidRequestError({code: ErrorCodes.MISSING_REQUEST_BODY, message: "Valid Email required", service: "user"});
        }

        try {
          const emailAlreadyExists = await userService.emailExists(email);
            if(emailAlreadyExists === true){
              return InvalidRequestError({code: ErrorCodes.MISSING_REQUEST_BODY, message: "Email Already Exists", service: "user"});
            }

            const newUser = await userService.createUser(escape(email), escape(name));    

            return {
                statusCode: 201,
                body: JSON.stringify({
                  apiResponse: newUser,
                }),
              }
          } catch (error: unknown) {
            const e = error as Error;
            console.error('Error creating user:', e);
            return ServerError({message: "Internal Server Error", code: ErrorCodes.DATA_PROVISION_ERROR, service: "user"})
          } finally {
            await userService.disconnect();
          }
      ;
}

export async function getUser(id: string) {
  const userService = new UserService();
  try{
    
    const user = await userService.getUser(escape(id));
    
    if(user){
      return {
        statusCode: 200,
        body: JSON.stringify({
          user
        })
      }
    }

    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "No User Found"
      })
    }
  }catch(error){
    const e = error as Error;
    return ServerError({message: "Internal Server Error", code: ErrorCodes.DATA_PROVISION_ERROR, service: "user"})
  } finally{
    await userService.disconnect();
  }
}