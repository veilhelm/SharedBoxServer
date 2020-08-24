const Space = require("../models/space.model")
module.exports = {
  addDateToSpace: async(date) => {
    const { _id, spaceId } = date
    const space = await Space.findById(spaceId)
    space.dateReservedId.push(_id)
    await space.save()
  }
}