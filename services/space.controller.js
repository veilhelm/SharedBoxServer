const eventEmiter = require('events')
const Space = require('../models/space.model')
const spaceSubscribers = require('../subscribers/space.subscribers')
const SpaceTag = require("../models/spaceTag.model")



const searchTermConstructor = query => {
    const searchTearm = {}
    if(query._id) searchTearm["_id"] = query._id
    if(query.location) searchTearm["city"] = query.location
    if(query.pricePerDay) searchTearm["pricePerDay"] =  {$lte: query.pricePerDay}
    if(query.pricePerMonth) searchTearm["pricePermonth"] =  {$lte: query.pricePerMonth}
    if(query.keyword) searchTearm["$or"] = [{title: {$regex: query.keyword}},{additionalInfo:{$regex: query.keyword}}]
    const [minArea, maxArea] = query.area ? query.area.split("-") : [0, 40000]
    const [minWidth, maxWidth] = query.width ? query.width.split("-") : [0, 200]
    const [minLength, maxLength] = query.length ? query.length.split("-") : [0, 200]
    const [minHeight, maxHeight] = query.height ? query.height.split("-") : [0, 10]
    searchTearm["area"] = {$gte: minArea, $lte: maxArea}
    searchTearm["width"] = {$gte: minWidth, $lte: maxWidth}
    searchTearm["length"] = {$gte: minLength, $lte: maxLength}
    searchTearm["height"] = {$gte: minHeight, $lte: maxHeight}
    return searchTearm
    }

const filterSpaceByDate = (arrSpaces = [], inDate, finDate) => {
    return arrSpaces.filter( ({dateReservedId}) => !dateReservedId.some( ({initialDate, finalDate}) => (Date.parse(inDate) < Date.parse(finalDate) && Date.parse(inDate) > Date.parse(initialDate) ) || (Date.parse(finDate) > Date.parse(initialDate) && Date.parse(finDate) < Date.parse(finalDate))))
}

const filterSpaceByTag = async (arrSpaces = [], tags = []) => {  
    if(arrSpaces.length === 0) return []
    const filterByTag = await SpaceTag.find({name : {$in : tags}}).populate("spaces")
    return arrSpaces.filter(({_id}) => filterByTag.some(({spaces}) => spaces.some(space =>space._id.equals(_id))))
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
            space.lenderId = req.user._id
            await space.save()
            this.emit("spaceCreated", space )
            res.status(200).json(space)
        }
        catch(err){
            res.status(400).json(err)
        }
    }
    
    getSpaceOfLender = async(req,res)=>{
        const lenderId = req.user._id
        const spaces = await Space.find({lenderId})
        .populate("spaceTags", ["name","description"])
        .populate("dateReservedId", ["initialDate", "finalDate"])
        .populate("faqs",["question","answer"])
        res.status(200).json(spaces)
    }

    getSpaceTenant = async (req, res) => {
        const {inDate, finDate, tag} = req.query
        const tags = tag ? tag.split("-") : null
        let response
        try{
            const foundResponse = await Space.find(searchTermConstructor(req.query))
            .populate("dateReservedId", ["initialDate", "finalDate", "tenantId"])
            .populate("spaceTags", ["name","description"])
            .populate("faqs", ["question", "answer"])
            response = foundResponse
            if(inDate && finDate) response = filterSpaceByDate(foundResponse, inDate, finDate)
            if(tag) response = await filterSpaceByTag(response, tags)
            res.status(200).json(response)
        }catch(err){
            res.status(400).json(err)
        }
    }

    updateSpace = async (req, res) => {
        try {
            const space = await Space.find({_id: req.body.spaceId})
            const updateSuccesful = await space[0].updateOne({...req.body.fields})
            res.status(200).json(updateSuccesful)
        }catch(err){
            res.status(400).json(err)
        }
    }

    savePhotos = async (req,res) => {
        const {spaceId} = req.body
        const files = Object.keys(req.body)
        files.shift()
        try{
            
            const space = await Space.findById(spaceId)
            files.map(file => {
                space.photos.push(req.body[file].secure_url)
            })
            await space.save()
            res.status(200).json(space.photos)
        }
        catch(err){
            res.status(400).json(err)
        }
    }


    deletePhotos = async (req,res)=> {
        const {photo, spaceId} = req.body
        try{
            const space= await Space.findById(spaceId)
            
            const newSpacePhotos = space.photos.filter(spacePhoto => spacePhoto !== photo)
            space.photos = newSpacePhotos
            await space.save()
            
            res.status(200).json("succesful deleting"+ photo)
        }
        catch(err){
            res.status(400).json(err)
        }
    }
    
}
const spaceServices = new SpaceServices()
spaceServices.on('spaceCreated',spaceSubscribers.addSpaceIdToLender)
module.exports = spaceServices
