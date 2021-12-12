// src/items/user.interface.ts

import { Document, ObjectId } from "mongoose";

export interface BaseUser extends Document {
    name: string;
    email: string;
    password: string;
    active?: boolean;
    confirmationToken?: string;
    confirmationTokenExpiration?: number;

}

export interface ExtendedUser extends BaseUser {
    _id: ObjectId;
}