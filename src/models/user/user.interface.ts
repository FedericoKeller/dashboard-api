// src/items/user.interface.ts

import { ObjectId } from "mongoose";

export interface BaseUser {
    name: string;
    email: string;
    password: string;
    active?: boolean;
    confirmationToken?: string;
    confirmationTokenExpiration?: Date;

}

export interface ExtendedUser extends BaseUser {
    _id: ObjectId;
}