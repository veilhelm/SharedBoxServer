const { Schema , model, Mongoose } = require("mongoose");
const validator = require("validator");

const spaceTagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: { 
    type: String,
  },
  spaces : {
    type: [{type: Schema.Types.ObjectId, ref:"Space"}]
  },
  id:{
    type: String,
    default: 1
  }
}, {
  timestamps: true
})

spaceTagSchema.methods.setDisplayId = async function () {
  this.id = this._id
  await this.save()
}

spaceTagSchema.methods.deleteSpaceId = async function (spaceIds = []) {
  this.spaces = this.spaces.filter( spaceID => !spaceIds.includes(spaceID))
  await this.save({overwrite: true})
}
const SpaceTag = new model("SpaceTag", spaceTagSchema);


module.exports = SpaceTag;