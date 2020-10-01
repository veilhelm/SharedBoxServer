const EventEmiter = require("events")
const Tenant =require("../models/tenant.model")
const bcrypt = require("bcrypt")
const subcriberTenant = require("../subscribers/tenant.subscribers")
const tenantSubscribers = require("../subscribers/tenant.subscribers")



class TenantServices extends EventEmiter{
    createNewTenant = async (req,res) => {
      const dataTenant = (({name,email,phoneNumber,password, notifications,profilePhoto})=>({name,email,phoneNumber,password, notifications, profilePhoto}))(req.body)      
      try{
        const tenant = await new Tenant(dataTenant)
        const token = await tenant.generateAuthToken()
        await tenant.encryptPassword()
        tenant.tokens.push(token)
        await tenant.save()
        this.emit("createTenant")
        res.status(201).json({userToken:token, id: tenant._id})
      }
      catch(err){
        res.status(400).json(err.message)
      }
    }

    savePhotos = async(req,res) => {
        const {userId} = req.body
        const files = req.body['file-0']
        try{
            const tenant = await Tenant.findById(userId)
            tenant.profilePhoto = files.secure_url
            await tenant.save({validateBeforeSave: false})
            res.status(200).json(tenant)
        }
        catch(err){
            res.status(400).json(err.message)
        }
    }
    loginTenant = async(req,res)=>{
        const {email , password} = req.body
        try{
            const tenant = await Tenant.findOne({email}) || {}
            const validPass = await bcrypt.compare(password,tenant.password || "" )
            if (Object.keys(tenant).length === 0 || !validPass) throw Error("email and password incorrect")
            const token = await tenant.generateAuthToken()
            await tenant.updateOne({tokens: [...tenant.tokens, token]})
            res.status(200).json({token,name: tenant.name})

        }catch(err){
            res.status(401).json(err.message)
        }
    }
    getInfoTenant = async(req,res)=>{
        res.status(200).json(req.user)
    }
    updateTenant = async (req,res)=> {
        if(req.body.password){
            req.user.password = req.body.password
            req.body.password = await req.user.encryptPassword()
        } 
        try{
            const updateSuccesful = await req.user.updateOne({...req.body})
            this.emit("updateTenant")
            res.status(200).json(req.user._id)
        }catch(err){
            console.dir(err)
            res.status(400).json(err.message)
        }
    }
    deleteTenant = async(req,res) => {
        const {tenantId} = req.body;
        try {
            const tenant = await Tenant.findByIdAndDelete(tenantId)  
            this.emit("deleteTenant",tenant)
            res.status(200).json("Tenant sucessfully deleted") 
        } catch (err){
            res.status(400).json(err)
        }
    }
    updateReservedSpaces = async(req,res) => {
        try {
            let reservedSpaces = req.user.reservedSpaces || {};
            if (!reservedSpaces.some(elem => elem == req.body.reservedSpaces)){
                reservedSpaces.push(req.body.reservedSpaces)
                const updateSuccesful = await Tenant.updateOne({_id: req.user._id},{reservedSpaces})
            }            
            res.status(200).json("Tenant sucessfully updated") 
        } catch(err){
            res.status(400).json(err.message)
        }

    }
}
const tenantServices = new TenantServices()
tenantServices.on("createTenant",subcriberTenant.sendRegisterTenant)
tenantServices.on("updateTenant",tenantSubscribers.sendUpdateTenant)
tenantServices.on("deleteTenant",tenantSubscribers.deleteTenantReferences)
module.exports = tenantServices
