const eventEmiter = require('events')
const Space = require('../models/space.model')
const spaceSubscribers = require('../subscribers/space.subscribers')
const SpaceTag = require("../models/spaceTag.model")
const space = require('../models/space.model')


const searchTermConstructor = query => {
    const searchTerm = {}
    if(query.title) searchTerm["title"] = query.title
    if(query.location) searchTerm["city"] = query.location
    if(query.pricePerDay) searchTerm["pricePerDay"] =  {$lte: query.pricePerDay}
    if(query.pricePerMonth) searchTerm["pricePermonth"] =  {$lte: query.pricePerMonth}
    if(query.keyword) searchTerm["$or"] = [{title: {$regex: query.keyword}},{additionalInfo:{$regex: query.keyword}}]
    const [minArea, maxArea] = query.area ? query.area.split("-") : [0, 40000]
    const [minWidth, maxWidth] = query.width ? query.width.split("-") : [0, 200]
    const [minLength, maxLength] = query.length ? query.length.split("-") : [0, 200]
    const [minHeight, maxHeight] = query.height ? query.height.split("-") : [0, 10]    
    searchTerm["area"] = {$gte: minArea, $lte: maxArea}
    searchTerm["width"] = {$gte: minWidth, $lte: maxWidth}
    searchTerm["length"] = {$gte: minLength, $lte: maxLength}
    searchTerm["height"] = {$gte: minHeight, $lte: maxHeight}
    return searchTerm
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
        const spaceData = (({title,area,width,length,height,pricePerDay,dateReservedId,spaceTags,additionalInfo,inventoryId,
                        lenderId,tenantId,city,address,latitude,longitude})=>({title,area,width,length, 
                            height,pricePerDay,dateReservedId,spaceTags,additionalInfo,
                        inventoryId,lenderId,tenantId,city,address,latitude,longitude}))(req.body)
        
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
        res.status(200).json(spaces)
    }

    getSpaceTenant = async (req, res) => {
        const {inDate, finDate, tag} = req.query
        const tags = tag ? tag.split(",") : null
        let response
        try{
            const foundResponse = await Space.find(searchTermConstructor(req.query))
            .populate("dateReservedId", ["initialDate", "finalDate", "tenantId"])
            .populate("spaceTags", ["name","description"])
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
                console.log(req.body[file].secure_url)
                space.photos.push(req.body[file].secure_url)
            })
            space.save()
            res.status(200).json(space)
        }
        catch(err){
            console.log(err)
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
