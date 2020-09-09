const {Schema, model} = require("mongoose");

const CommentSchema = new Schema({
  giverId:  {
    type: Schema.Types.ObjectId,
    required: true
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    required: true
  },  
  comment: {
    type: String,
    required: true
  }
},{
  timestamps: true
})

const comment = new model("Comment", CommentSchema)
module.exports = comment