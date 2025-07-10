import { postModel } from "../models/post.model.js"; 

export const likeFeature = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  console.log(userId)
  // "686dfe3262847a3fb48c5a5e"

  // const userId = 

  try {
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user already liked the post
    const likedIndex = post.likes.findIndex(
      (like) => like.user.toString() === userId
    );

    if (likedIndex !== -1) {
      // 🔄 Already liked → remove like (unlike)
      post.likes.splice(likedIndex, 1);
      post.likesCount -= 1;

      await post.save();

      return res.status(200).json({
        message: "❎ Post unliked successfully",
        likesCount: post.likesCount,
        likes: post.likes,
      });
    } else {
      // ❤️ Not liked yet → add like
      post.likes.push({ user: userId });
      post.likesCount += 1;

      await post.save();

      return res.status(200).json({
        message: "✅ Post liked successfully",
        likesCount: post.likesCount,
        likes: post.likes,
      });
    }
  } catch (error) {
    console.error("❌ Error in likeFeature:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
