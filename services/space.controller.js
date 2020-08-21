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
            const pricePerMonths = await space.monthCalculation()
            await space.save()
            this.emit("spaceCreatedinlender",space.lenderId,space._id)            
            this.emit("spaceCreated")
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
spaceServices.on('spaceCreatedinlender',spaceSubscribers.spaceCreatedInLender)
spaceServices.on('spaceCreated',spaceSubscribers.spaceCreated)
module.exports = spaceServices