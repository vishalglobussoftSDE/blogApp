import { postModel } from "../models/post.model.js";
import { userModel } from "../models/user.model.js";
export const createPost = async (req, res) => {
  const { title, content, author, tags } = req.body;
  const authorName = req.user.userId;
  // Validation
  if (!title || !content || !author || !tags) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Create new post
    const newPost = new postModel({
      title,
      content,
      author,
      tags,
    });
     await userModel.findByIdAndUpdate(authorName, {
      $push: { posts: newPost._id }
    });
    // Save to MongoDB
    await newPost.save();
    

    res.status(201).json({
      message: '✅ Post created successfully',
      post: newPost,
    });
  } catch (error) {
    console.error('❌ Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
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
export const editPostById = async(req,res)=>{
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
export const deletePostById = async(req,res)=>{
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