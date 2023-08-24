import mongoose from "mongoose";
const authSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    isAdmin:{
        type: Boolean
    },
    phoneNumber: {
        type: String,
        unique: true
    }

}, {timestamps: true})

export default mongoose.model("dusstech-auth", authSchema)