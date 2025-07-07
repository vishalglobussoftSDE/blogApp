import { postModel } from '../models/post.model.js';

export const createComment = async (req, res) => {
  const { text , postId} = req.body;
  const userId = req.user.userId; // From authenticate middleware
  console.log(userId)

  if (!text || !postId) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  try {
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment = {
      user: userId,
      text,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({
      message: '✅ Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    console.error('❌ Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

export const updateComment = async (req, res) => {
  const { postId, commentId, text } = req.body;
  const userId = req.user.userId; // From token

  if (!postId || !commentId || !text) {
    return res.status(400).json({ error: 'postId, commentId, and text are required' });
  }

  try {
    // Find the post containing the comment
    const post = await postModel.findOne({
      _id: postId,
      "comments._id": commentId
    });

    if (!post) {
      return res.status(404).json({ error: 'Post or comment not found' });
    }

    // Find the specific comment
    const comment = post.comments.id(commentId);

    // Optional: check if the user is the owner
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized to edit this comment' });
    }

    // Update the comment text
    comment.text = text;
    await post.save();

    res.status(200).json({
      message: '✅ Comment updated successfully',
      comment
    });
  } catch (error) {
    console.error('❌ Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};