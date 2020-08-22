const eventEmiter = require('events')
const Space = require('../models/space.model')
const spaceSubscribers = require('../subscribers/space.subscribers')

class SpaceServices extends eventEmiter{

    createSpace = async (req,res) => {
        const spaceData = (({area,width,length,height,pricePerDay,dateReservedId,spaceTags,aditionalInfo,inventoryId,
                        lenderId,tenantId,city,address,latitude,longitude})=>({area,width,length, 
                            height,pricePerDay,dateReservedId,spaceTags,aditionalInfo,
                        inventoryId,lenderId,tenantId,city,address,latitude,longitude}))(req.body)
        
        try{
            const space = await new Space(spaceData)
            space.monthCalculation()
            space.lenderId = req.lender._id
            await space.save()
            this.emit("spaceCreated", space )   
            res.status(200).json(space)
        }
        catch(err){
            res.status(400).json(err)
        }
    }
    
    getSpace = async(req,res)=>{
        const lenderId = req.lender._id
        const spaces = await Space.find({lenderId})
        res.status(200).json(spaces)
    }
    
}
const spaceServices = new SpaceServices()
spaceServices.on('spaceCreated',spaceSubscribers.addSpaceIdToLender)
module.exports = spaceServices