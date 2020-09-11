const EventEmitter = require("events");
const SpaceTag = require("../models/spaceTag.model.js");
const  spaceTagsSubscribers = require("../subscribers/spaceTags.Subscribers")

class SpaceTagService extends EventEmitter {
  createSpaceTag = async(req,res) => {
    const spaceData  = (({ name, description, spaces}) => ({name, description, spaces}))(req.body);
    try {
      const newSpaceTag = await new SpaceTag(spaceData);
      await newSpaceTag.setDisplayId()
      this.emit("spaceTagCreated", newSpaceTag)
      res.status(201).json(newSpaceTag);
    } catch(err) {
      res.status(400).json(err.message)
    }
  }

  getSpaceTag = async(req,res) => {
    try {
      const space  = await SpaceTag.find({tag: req.body.tag});
      res.status(200).json(space) 
    } catch (err){
      res.status(400).json(err.message)
    }
  }

  getTags = async (req, res) => {
    try{
      const tags = await SpaceTag.find()
      res.status(200).json(tags)
    }catch(err) {
      res.status(400).json(error)
    }
  }

  addSpaceToTag = async (req, res) => {
    try{
      const tag = await SpaceTag.find({name: req.body.name})
      tag[0].spaces.push(req.body.spaceId)
      await tag[0].save({ validateBeforeSave: false })
      this.emit("spaceTagCreated", tag[0])
      res.status(200).json(true)
      }catch(error){
        console.log(error)
      res.status(400).json(error)
      }
  }
}

const spaceTagService = new SpaceTagService();
spaceTagService.on("spaceTagCreated", spaceTagsSubscribers.addSpaceTagIdToSpace)

module.exports = spaceTagService;