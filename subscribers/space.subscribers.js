const Lender =require('../models/lender.model')
module.exports = {
    addSpaceIdToLender: async (space) => {
        const { _id, lenderId } = space
        const lender = await Lender.findById(lenderId)
        lender.spaces.push(_id)
        await lender.save()
    }
}