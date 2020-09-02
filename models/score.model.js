const {Schema, model} = require("mongoose");

const ScoreSchema = new Schema({
  giverId:  {
    type: Schema.Types.ObjectId,
    required: true
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    required: true
  },  
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  }
},{
  timestamps: true
})

const score = new model("Score", ScoreSchema)
module.exports = score