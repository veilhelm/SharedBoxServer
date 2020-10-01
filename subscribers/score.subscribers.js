const Lender = require("../models/lender.model")
const Score = require("../models/score.model")
module.exports = {
  addScoreToPeople: async({scoreParams, res}) => {
    try {
      const { _id, giverId, receiverId, score } = scoreParams
      const lender = await Lender.find({
        '_id':{
          $in: [giverId, receiverId]
        }
      })
      const results = [];
      let scoresPopulated = await lender[0].populate("scores").execPopulate()
      for (const element of scoresPopulated.scores) {
        results.push(element.score);
      }
      let prevSum = 0;
      if (results.length > 0){
        prevSum = results.reduce( (acc, element) => acc + element, 0 );
      }    
      const totalAverage = (prevSum + score)/ (results.length + 1);
      lender[0].averageScore = totalAverage
      lender[0].scores.push(_id)
      //Tenant waiting
      await lender[0].save()
    } catch (err){
      res.status(400).json(err)
    }
    
  }
}