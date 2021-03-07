const { AuthenticationError, UserInputError } = require("apollo-server");

const checkAuth = require("../../utils/check-auth");
const Post = require("../../models/Post");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById({ _id: postId });
        if (!post) {
          throw new Error("Post not found!");
        }

        return post;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new Error("Post body must not be empty!");
      }

      try {
        const newPost = new Post({
          body,
          user: user.id,
          username: user.username,
          createdAt: new Date().toISOString()
        });

        const post = await newPost.save();

        context.pubsub.publish("NEW_POST", { newPost: post });

        return post;
      } catch (err) {
        throw new Error(err);
      }
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById({ _id: postId });
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted!";
        } else {
          throw new AuthenticationError("Action not allowed!");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async updatePost(_, { postId, body }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById({ _id: postId });
        if (user.username === post.username) {
          post.body = body;
          await post.save();
          return "Post updated!";
        } else {
          throw new AuthenticationError("Action not allowed!");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      try {
        const post = await Post.findById({ _id: postId });

        if (post) {
          if (post.likes.find(like => like.username === username)) {
            // Post already likes, unlike it
            post.likes = post.likes.filter(like => like.username !== username);
          } else {
            // Not liked, like post
            post.likes.push({
              username,
              createdAt: new Date().toISOString()
            });
          }

          await post.save();
          return post;
        } else {
          throw new UserInputError("Post not found!");
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST")
    }
  }
};
