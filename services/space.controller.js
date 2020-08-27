const eventEmiter = require('events')
const Space = require('../models/space.model')
const spaceSubscribers = require('../subscribers/space.subscribers')
const { search } = require('../routes/datesReserved.route')

const searchTermConstructor = query => {
    const searchTearm = {}
    if(query.location) searchTearm["city"] = query.location
    if(query.pricePerDay) searchTearm["pricePerDay"] =  {$lte: query.pricePerDay}
    if(query.pricePerMonth) searchTearm["pricePermonth"] =  {$lte: query.pricePerMonth}
    if(query.keyword) searchTearm["$or"] = [{title: {$regex: query.keyword}},{additionalInfo:{$regex: query.keyword}}]
    const [minArea, maxArea] = query.area ? query.area.split("-") : [0, 40000]
    const [minWidth, maxWidth] = query.width ? query.width.split("-") : [0, 200]
    const [minLength, maxLength] = query.length ? query.length.split("-") : [0, 200]
    const [minHeight, maxHeight] = query.height ? query.height.split("-") : [0, 200]
    searchTearm["area"] = {$gte: minArea, $lte: maxArea}
    searchTearm["width"] = {$gte: minWidth, $lte: maxWidth}
    searchTearm["length"] = {$gte: minLength, $lte: maxLength}
    searchTearm["height"] = {$gte: minHeight, $lte: maxHeight}
    return searchTearm
    }

class SpaceServices extends eventEmiter{

    createSpace = async (req,res) => {
        const spaceData = (({area,width,length,height,pricePerDay,dateReservedId,spaceTags,additionalInfo,inventoryId,
                        lenderId,tenantId,city,address,latitude,longitude,title})=>({area,width,length, 
                            height,pricePerDay,dateReservedId,spaceTags,additionalInfo,
                        inventoryId,lenderId,tenantId,city,address,latitude,longitude,title}))(req.body)
        
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
    
    getSpaceOfLender = async(req,res)=>{
        const lenderId = req.lender._id
        const spaces = await Space.find({lenderId})
        res.status(200).json(spaces)
    }

    getSpaceTenant = async (req, res) => {
        const response = await Space.find(searchTermConstructor(req.query), null, {}, (err, docs) => {
            console.log({control: docs})
        })
        res.status(200).json(response)
    }
    
}
const spaceServices = new SpaceServices()
spaceServices.on('spaceCreated',spaceSubscribers.addSpaceIdToLender)
module.exports = spaceServices