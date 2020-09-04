const { Schema , model, Mongoose } = require("mongoose");
const validator = require("validator");

const questionAnswerSchema = new Schema({
  spaceId: {
    type: Schema.Types.ObjectId, 
    ref: "Space"
  },
  question:{
      type:String
  },
  answer:{
      type:String
  }
}, {
  timestamps: true
})

const questionAnswer = new model("questionAnswer", questionAnswerSchema);

module.exports = questionAnswer;
