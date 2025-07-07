import mongoose, { model, Schema } from 'mongoose'

const postSchema = new Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    author: {
        type: String,
    },
    tags: {
        type: String,
    },
    comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      text: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
    published : {
        type : String,
    }
}, { timestamps: true })

export const postModel = model("Post", postSchema)
