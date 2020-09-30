const eventEmiter = require('events')
const Space = require('../models/space.model')
const spaceSubscribers = require('../subscribers/space.subscribers')
const SpaceTag = require("../models/spaceTag.model")
const cloudinary = require('cloudinary').v2
const moment = require("moment")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const searchTermConstructor = query => {
    const pagination= {}
    const searchTerm = {}
    if(query._id) searchTerm ["_id"] = query._id
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
    pagination["limit"] = query.limit ? parseInt(query.limit) : 10
    pagination["skip"] = query.page ? parseInt(query.limit) * (parseInt(query.page) - 1) : 0
    return {
        searchTerm,
        pagination
    }

    }
const finalGreaterThanIn = (inDate, finalDate, initialDate) => {
    let result = Date.parse(inDate) <= Date.parse(finalDate) 
    return result
}

const finDateGreaterThanInitial = (finDate, initialDate, finalDate) => {
    let result = Date.parse(finDate) >= Date.parse(initialDate)
    return result
}
const filterSpaceOutsideDates = async (arrSpaces = [], inDate, finDate) => {
    let filteredSpaces = arrSpaces.filter( ({dateReservedId}) => {
        const someRes = dateReservedId.some( ({initialDate, finalDate}) => 
        finalGreaterThanIn(inDate, finalDate, initialDate)
        && finDateGreaterThanInitial(finDate, initialDate, finalDate))
        return someRes
    })
    return filteredSpaces
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
        .populate("faqs",["question","answer", "_id"])
        res.status(200).json(spaces)
    }

    getSpaceTenant = async (req, res) => {
        const {inDate, finDate, tag} = req.query
        const tags = tag ? tag.split(",") : null
        let response
        const searchTerm = searchTermConstructor(req.query)
        try{
            const foundResponse = await Space.find({...searchTerm.searchTerm})
            .populate("dateReservedId", ["initialDate", "finalDate", "tenantId"])
            .populate("spaceTags", ["name","description"])
            .populate("faqs", ["question", "answer", "_id"])
            response = foundResponse
            if(inDate && finDate) response = filterSpaceByDate(foundResponse, inDate, finDate)
            if(tag) response = await filterSpaceByTag(response, tags)
            const maxPages = Math.ceil(response.length / searchTerm.pagination.limit)
            const arr = response.slice(searchTerm.pagination.skip , searchTerm.pagination.skip + searchTerm.pagination.limit )
            res.status(200).set(`Content-Pages`, maxPages ).json(arr)
        }catch(err){
            res.status(400).json(err.message)
        }
    }

    getSpaceRegisteredTenant = async (req, res) => {
        const {state} = req.query
        let response, inDate, finDate  
        const searchTerm = searchTermConstructor(req.query)            
        try{ 
            switch(state){
                case 'current':
                    inDate = moment().format("YYYY-MM-DD")
                    finDate = moment().add(1,'days').format("YYYY-MM-DD")
                    
                    break
                case 'reserved':
                    break
                case 'incoming':
                    break
                default:                 
            }      
            let foundResponse = await Space.find()
                .populate({path: "dateReservedId", model: "DatesReserved", match:{tenantId: req.user._id }, select: "initialDate finalDate tenantId"})
                .populate("spaceTags", ["name","description"])
                .populate("faqs", ["question", "answer", "_id"])                
                 
            response = foundResponse.filter(elem => elem.dateReservedId.length > 0);
            if(inDate && finDate) response = await filterSpaceOutsideDates(response, inDate, finDate) 
            /*const maxPages = Math.ceil(response.length / searchTerm.pagination.limit)
            const arr = response.slice(searchTerm.pagination.skip , searchTerm.pagination.skip + searchTerm.pagination.limit )*/
            res.status(200).json(response)
        }catch(err){
            res.status(400).json(err.message)
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
            await space.save({validateBeforeSave: false})
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
            space.photos = space.photos.filter(spacePhoto => spacePhoto !== photo)
            await space.save({validateBeforeSave: false})
            const publicId = photo.split("/").pop().replace(".jpg","").split(".")[0]
            cloudinary.uploader.destroy(
                `sharedBox/${publicId}`,
                (err,result)=>{
                    console.log(err, result)
                }
            )
            res.status(200).json("succesfully deleting"+ photo)
        }
        catch(err){
            res.status(400).json(err)
        }
    }
    
}
const spaceServices = new SpaceServices()
spaceServices.on('spaceCreated',spaceSubscribers.addSpaceIdToLender)
module.exports = spaceServices
