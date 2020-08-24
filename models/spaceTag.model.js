const { Schema , model, Mongoose } = require("mongoose");
const validator = require("validator");

const spaceTagSchema = new Schema({
  tag: {
    type: String,
    required: true
  },
  description: { 
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const SpaceTag = new model("SpaceTag", spaceTagSchema);

module.exports = SpaceTag;