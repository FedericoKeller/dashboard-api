// src/items/user.service.ts

/**
 * Data Model Interfaces
 */

import { BaseUser, ExtendedUser, } from '../models/user/user.interface';
import User from '../models/user/user.model';


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


