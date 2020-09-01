const EventEmiter = require("events")
const Tenant =require("../models/tenant.model")
const subcriberTenant = require("../subscribers/tenant.subscribers")

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
}
const tenantServices = new TenantServices()
tenantServices.on("createTenant",subcriberTenant.sendRegisterTenant)
module.exports = tenantServices