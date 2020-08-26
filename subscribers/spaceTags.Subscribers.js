const Space = require("../models/space.model")

module.exports = {
    addSpaceTagIdToSpace: async ({spaces , _id}) => {
        const space = await Space.findById(spaces[spaces.length-1])
        space.spaceTags.push(_id)
        await space.save()
    }    

}