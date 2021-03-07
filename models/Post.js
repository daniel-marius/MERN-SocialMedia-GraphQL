const { model, Schema } = require("mongoose");

const postSchema = new Schema({
  body: {
    type: String
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: String
  },
  comments: [
    {
      body: {
        type: String
      },
      username: {
        type: String,
        required: true
      },
      createdAt: {
        type: String
      }
    }
  ],
  likes: [
    {
      body: {
        type: String
      },
      username: {
        type: String,
        required: true
      }
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  }
});

module.exports = model("Post", postSchema);
