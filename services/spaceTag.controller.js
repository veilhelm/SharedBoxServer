const EventEmitter = require("events");
const SpaceTag = require("../models/spaceTag.model.js");

class SpaceTagService extends EventEmitter {
  createSpaceTag = async(req,res) => {
    const spaceData  = (({ spaceId, tag, description}) => ({spaceId, tag, description}))(req.body);
    try {
      const newSpaceTag = await new SpaceTag(spaceData).save();
      res.status(201).json(newSpaceTag);
    } catch(err) {
      res.status(400).json(err.message)
    }
  }
  getSpaceTag = async(req,res) => {
    console.log(req.body)
    try {
      const space  = await SpaceTag.find({spaceId: req.body.spaceId});
      res.status(200).json(space) 
    } catch (err){
      res.status(400).json(err.message)
    }
  }
}

const spaceTagService = new SpaceTagService();
module.exports = spaceTagService;