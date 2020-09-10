const EventEmiter = require("events")
const Tenant =require("../models/tenant.model")
const bcrypt = require("bcrypt")
const subcriberTenant = require("../subscribers/tenant.subscribers")
const tenantSubscribers = require("../subscribers/tenant.subscribers")



class TenantServices extends EventEmiter{
    createNewTenant = async (req,res) => {
      const dataTenant = (({name,email,phoneNumber,password, notifications})=>({name,email,phoneNumber,password, notifications}))(req.body)      
      try{
        const tenant = await new Tenant(dataTenant)
        const token = await tenant.generateAuthToken()
        await tenant.encryptPassword()
        tenant.tokens.push(token)
        await tenant.save()
        this.emit("createTenant")
        res.status(201).json(token)
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
            res.status(200).json(token)

        }catch(err){
            res.status(400).json(err.message)
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
            res.status(200).json(updateSuccesful)
        }catch(err){
            console.dir(err)
            res.status(400).json(err.message)
        }
    }
}
const tenantServices = new TenantServices()
tenantServices.on("createTenant",subcriberTenant.sendRegisterTenant)
tenantServices.on("updateTenant",tenantSubscribers.sendUpdateTenant)
module.exports = tenantServices
