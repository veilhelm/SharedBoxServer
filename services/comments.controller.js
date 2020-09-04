const EventEmiter = require("events");
const Comment = require("../models/comment.model");
const CommentSubscribers = require("../subscribers/comment.subscribers");

class CommentService extends EventEmiter {
  createNewComment = async (req,res) => {
    const commentData = (({giverId, receiverId, comment}) => ({giverId, receiverId, comment}))(req.body);
    try {
      const newComment = await new Comment(commentData);
      this.emit("CommentCreated", {newComment, res})
      await newComment.save();
      res.status(201).json(newComment)
    } catch (err){
      res.status(400).json(err.message)
    }
  }
}

const commentService = new CommentService();
commentService.on('commentCreated',CommentSubscribers.addCommentToPeople);

module.exports = commentService