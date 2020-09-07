const Lender = require("../models/lender.model")
const Comment = require("../models/comment.model")
module.exports = {
  addCommentToPeople: async({commentParams, res}) => {
    try {
      const { _id, giverId, receiverId, comment } = commentParams
      const lender = await Lender.find({
        '_id':{
          $in: [giverId, receiverId]
        }
      })      
      lender[0].comments.push(_id)
      //Tenant waiting
      await lender[0].save()
    } catch (err){
      res.status(400).json(err)
    }
    
  }
}