const Lender =require('../models/lender.model')
module.exports = {
    spaceCreated : () => {
        console.log("your space was created")

    },
    spaceCreatedInLender: async (lenderId,spaceId) => {
       const lender = await Lender.findById(lenderId)
       lender.spaces.push(spaceId)
       await lender.save()
    }
}