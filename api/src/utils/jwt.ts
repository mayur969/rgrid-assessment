import jwt from "jsonwebtoken";
import { env } from "../../env";

export const generateToken = (id:string)=>{

    return jwt.sign( {id}, env.JWT_SECRET , {expiresIn:"7d",} );

};