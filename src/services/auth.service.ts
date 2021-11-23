// src/items/user.service.ts

/**
 * Data Model Interfaces
 */

import { BaseUser, ExtendedUser } from '../models/user/user.interface';
import User from '../models/user/user.model';
import Verification from '../models/verification/verification.model';
import  { randomBytes } from "crypto";
import HttpException from '../common/http-exception';
import { createTransport } from 'nodemailer';


const MAILTRAP_TRANSPORT = createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "8e729f08981763",
    pass: "420615a1526557"
  }
});
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


export const generateConfirmationEmail = async (user: any) => {
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

    

    console.log(`http://localhost:3001/reset/${token}`);

    MAILTRAP_TRANSPORT.sendMail({
      to: user.email,
      from: "no-reply@dashsmart.com",
      subject: "Password Reset",
      html: `
          <p>Welcome!</p>
          <p>Click this <a href="http://localhost:3001/reset/${token}">link</a> to confirm your account.</p>
      `,
    });




  })
} 


