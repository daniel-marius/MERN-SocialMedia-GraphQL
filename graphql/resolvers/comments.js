const { AuthenticationError, UserInputError } = require("apollo-server");

const checkAuth = require("../../utils/check-auth");
const Post = require("../../models/Post");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);

      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "Comment body must not be empty!"
          }
        });
      }

      try {
        const post = await Post.findById({ _id: postId });

        if (post) {
          post.comments.unshift({
            body,
            username,
            createdAt: new Date().toISOString()
          });

          await post.save();
          return post;
        } else {
          throw new UserInputError("Post not found!");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async deleteComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context);

      try {
        const post = await Post.findById({ _id: postId });

        if (post) {
          const commentIndex = post.comments.findIndex(c => c.id === commentId);

          if (post.comments[commentIndex].username === username) {
            post.comments.splice(commentIndex, 1);
            await post.save();
            return post;
          } else {
            throw new AuthenticationError("Action not allowed!");
          }
        } else {
          throw new UserInputError("Post not found!");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async updateComment(_, { postId, commentId, body }, context) {
      const { username } = checkAuth(context);

      try {
        const post = await Post.findById({ _id: postId });

        if (post) {
          const commentIndex = post.comments.findIndex(c => c.id === commentId);

          if (post.comments[commentIndex].username === username) {
            post.comments[commentIndex].body = body;
            await post.save();
            return post;
          } else {
            throw new AuthenticationError("Action not allowed!");
          }
        } else {
          throw new UserInputError("Post not found!");
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};
