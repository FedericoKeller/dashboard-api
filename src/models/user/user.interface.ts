// src/items/user.interface.ts

import { ObjectId } from "mongoose";

export interface BaseUser {
    name: string;
    email: string;
    password: string;
}

export interface ExtendedUser extends BaseUser {
    _id: ObjectId;
}