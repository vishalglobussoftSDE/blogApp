import { postModel } from "../models/post.model.js";
import { userModel } from "../models/user.model.js";
import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
// import dotenv from 'dotenv';
// dotenv.config();
const s3 = new S3Client({
  endpoint: process.env.WASABI_ENDPOINT,
  region: process.env.WASABI_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY,
    secretAccessKey: process.env.WASABI_SECRET_KEY,
  },
});

export const createPost = async (req, res) => {
  const { title, content, tags } = req.body;
  const file = req.file;
  const authorName = req.user.userId;

  // Validation
  if (!file) {
    return res.status(400).json({ error: 'file is required in body' });
  }      

  if (!title || !content || !tags) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const fileName = `${file.originalname}`;
  const key = `blog/${fileName}`; // Save this in DB

  const command = new PutObjectCommand({
    Bucket: process.env.WASABI_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    // Image is private (ACL not set)
  });

  try {
    await s3.send(command);

    const newPost = new postModel({
      title,
      content,
      tags,
      authorName,
      imgUrl: `https://s3.${process.env.WASABI_REGION}.wasabisys.com/${process.env.WASABI_BUCKET}/${key}`
, 
    });
    console.log(newPost.imgUrl);
    await userModel.findByIdAndUpdate(authorName, {
      $push: { posts: newPost._id },
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const getPost = async (req, res) => {
  try {
    const posts = await postModel.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(posts);
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('❌ Error fetching post by ID:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

export const editPostById = async (req, res) => {
  const { id } = req.params;
  const { title, content, author, tags } = req.body;

  try {
    const updatedPost = await postModel.findByIdAndUpdate(
      id,
      { title, content, author, tags },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({
      message: '✅ Post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    console.error('❌ Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

export const deletePostById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await postModel.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: '✅ Post deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
}