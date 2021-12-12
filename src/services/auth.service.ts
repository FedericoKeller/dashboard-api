// src/items/user.service.ts

/**
 * Data Model Interfaces
 */

import { BaseUser } from '../models/user/user.interface';
import User from '../models/user/user.model';
import  { randomBytes } from "crypto";
import HttpException from '../common/http-exception';
import { IData } from './email-builder';
import { EmailBuilder } from './email-builder.service';

/**
 * Service Methods
 */

export const find = async(email: string) =>  {
    let user;

    try {
      user = await User.findOne({email: email});
      console.log(user)
    } catch(err) {
        console.log(err);
    }

    return user;
}


export const generateConfirmationEmail = async (user: BaseUser) => {
  randomBytes(32, async (err, buffer) => {
    if(err) {
      const error = new HttpException(422, "Error while generating confirmation e-mail");
      throw error;
    }

    const token = buffer.toString("hex");
    user.confirmationToken = token;
    user.confirmationTokenExpiration = Date.now() + 3600000;
    
    try {
      await user.save();

    } catch (error: any) {
      error.statusCode = 500;
      throw error;
    }


    const raw1 = {user: user, token: token} as IData;
    console.log(raw1)
    new EmailBuilder(raw1).generateEmailTemplate('ResetPassword').sendEmail();
    






  })
} 

export class Test {

}

