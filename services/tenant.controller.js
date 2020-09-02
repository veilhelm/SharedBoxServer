const EventEmiter = require("events")
const Tenant =require("../models/tenant.model")
const bcrypt = require("bcrypt")
const subcriberTenant = require("../subscribers/tenant.subscribers")
const tenantSubscribers = require("../subscribers/tenant.subscribers")
const { json } = require("express")

class TenantServices extends EventEmiter{
    createNewTenant = async (req,res) => {
      const dataTenant = (({name,email,phoneNumber,password})=>({name,email,phoneNumber,password}))(req.body)
      try{
          const tenant = await new Tenant(dataTenant)
          const token = await tenant.generateAuthToken()
          this.emit("createTenant")
          res.status(200).json(token)
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
            res.status(200).json(token)

        }catch(err){
            res.status(400).json(err.message)
        }
    }
    getInfoTenant = async(req,res)=>{
        res.status(200).json(req.user)
    }
    updateTenant = async (req,res)=>{
        if(req.body.password) req.user.passwordIsEncrypted = false
        Object.keys(req.body).forEach( param => req.user[param] = req.body[param])
        try{
            const updateTenant = await req.user.save()
            this.emit("updateTenant")
            res.status(200).json(updateTenant)
        }
        catch(err){
            res.status(400).json(err.message)
        }
        
    }
}
const tenantServices = new TenantServices()
tenantServices.on("createTenant",subcriberTenant.sendRegisterTenant)
tenantServices.on("updateTenant",tenantSubscribers.sendUpdateTenant)
module.exports = tenantServices