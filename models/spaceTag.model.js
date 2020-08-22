const { Schema , model, Mongoose } = require("mongoose");
const validator = require("validator");

const spaceTagSchema = new Schema({
  tag: String,
  description: String
}, {
  timestamps: true
})

const SpaceTag = new model("SpaceTag", spaceTagSchema);

module.exports = SpaceTag;