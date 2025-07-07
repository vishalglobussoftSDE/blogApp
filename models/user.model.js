import mongoose, { model, Schema } from 'mongoose'

const userSchema = new Schema({
    name: {
        type: String,
    },
    username :{
        type : String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
    },
    imgUrl :{
        type : String,
    },
    posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'  // This refers to the postModel
  }],
}, { timestamps: true })

export const userModel = model("User", userSchema)
