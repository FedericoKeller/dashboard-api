import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";


export const login = async(req: Request, res: Response) => {
    const email: string =  req.body.email;
    
    try {
        const user = await AuthService.find(email);

        res.status(200).json({
            message: "User found!",
            user: user,
        })
    }catch(err: any) {
        res.status(500).json({
            error: err.message
        })
    }
}

