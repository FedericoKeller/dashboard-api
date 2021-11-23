import { Schema, model } from "mongoose";
import { BaseUser } from "./user.interface";


const userSchema = new Schema<BaseUser>({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    active: Boolean,
    confirmationToken: String,
    confirmationTokenExpiration: Date
})

const User = model<BaseUser>("User", userSchema);

export default User;