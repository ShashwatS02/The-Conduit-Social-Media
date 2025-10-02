import asyncHandler from "express-async-handler";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

// @desc    Get algorithmic feed with pagination
// @route   GET /api/posts/feed
// @access  Public
const getAlgorithmicFeed = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  try {
    const posts = await Post.aggregate([
      {
        $addFields: {
          // Calculate engagement score
          hotScore: {
            $add: [
              { $multiply: [{ $ifNull: [{ $size: "$likes" }, 0] }, 2] }, // Likes are worth 2 points
              { $ifNull: ["$commentCount", 0] }, // Comments are worth 1 point
              {
                // Time decay factor (score decreases over time)
                $divide: [
                  1,
                  {
                    $add: [
                      1,
                      {
                        $divide: [
                          { $subtract: [new Date(), "$createdAt"] },
                          1000 * 60 * 60 * 24 * 7, // Divide by a week in milliseconds
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      { $sort: { hotScore: -1, createdAt: -1 } }, // Sort by score, then date
      { $skip: skip },
      { $limit: pageSize },
      {
        $lookup: {
          // Join with users collection to get author info
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorInfo",
        },
      },
      {
        $unwind: {
          // Deconstruct the authorInfo array
          path: "$authorInfo",
          preserveNullAndEmptyArrays: true, // Keep posts even if author is deleted
        },
      },
      {
        $project: {
          // Select the final fields to return
          content: 1,
          imageUrl: 1,
          likes: 1,
          commentCount: 1,
          createdAt: 1,
          author: {
            _id: "$authorInfo._id",
            username: "$authorInfo.username",
            profile: "$authorInfo.profile",
          },
        },
      },
    ]);

    res.status(200).json(posts || []);
  } catch (error) {
    console.error("Error in getAlgorithmicFeed:", error);
    res.status(500).json({ message: "Server error while fetching feed." });
  }
});

// --- Other controller functions remain the same ---

const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  // ... (rest of function)
  const post = new Post({ content, author: req.user._id });
  const createdPost = await post.save();
  const populatedPost = await Post.findById(createdPost._id).populate(
    "author",
    "username profile"
  );
  res.status(201).json(populatedPost);
});

const getPostsByUser = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.params.userId })
    .populate("author", "username profile")
    .sort({ createdAt: -1 });
  res.json(posts);
});

const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    const userId = req.user._id.toString();
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json({ likes: post.likes });
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const post = await Post.findById(req.params.id);
  if (post) {
    const comment = new Comment({
      content,
      author: req.user._id,
      post: req.params.id,
    });
    const createdComment = await comment.save();
    post.commentCount = (post.commentCount || 0) + 1;
    await post.save();
    const populatedComment = await Comment.findById(
      createdComment._id
    ).populate("author", "username profile");
    res.status(201).json(populatedComment);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.id })
    .populate("author", "username profile")
    .sort({ createdAt: "asc" });
  res.json(comments);
});

export {
  getAlgorithmicFeed,
  createPost,
  getPostsByUser,
  likePost,
  addComment,
  getComments,
};
