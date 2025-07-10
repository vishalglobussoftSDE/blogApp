import mongoose, { model, Schema } from 'mongoose';

const postSchema = new Schema({
  title: {
    type: String,
  },
  imgUrl: {
    type: String,
  },
  content: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  tags: {
    type: String,
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  likes: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    likedAt: {
      type: Date,
      default: Date.now,
    },
  }
],
likesCount: {
  type: Number,
  default: 0,
},
  published: {
    type: String,
  },
}, { timestamps: true });

export const postModel = model("Post", postSchema);
