const {Schema , model} =require('mongoose')
const bcript = require('bcrypt')
const jwt =require('jsonwebtoken')
const {emailValidators, passwordValidators} = require("../utils/validators")
 
const tenantSchema = new Schema({
    name:{
        type: String,
        trim:true,
        required:true,
        uppercase:true
    },
    email:{
        type:String,
        trim:true,
        lowercase:true,
        validate: emailValidators("tenant")
    },
    password:{
        type:String,
        required:true,
        validate: passwordValidators.bind(this)
    },
    phoneNumber:{
        type:String,
        trim:true,
        required:true,
        minlength:10,
        maxlength:13
    },
    passwordIsEncrypted:{
        type: Boolean,
        default: false
    },
    scores:{
        type:[{type:Schema.Types.ObjectId, ref:"Score"}]
    },
    averageScore:{
        type:Number,
        default:0
    },
    currentSpaces:{
        type:[{type:Schema.Types.ObjectId, ref:"currentSpace"}]
    },
    reservedSpaces:{
        type:[{type:Schema.Types.ObjectId, ref:"reservedSpace"}]
    },
    usedSpaces:{
        type:[{type:Schema.Types.ObjectId, ref:"usedSpace"}]
    },
    tokens:[
        {
            type:String
        }
    ],
    country:{
        type: String,
        default: "Colombia"
    },
    city: {
        type: String
    }
},{
    timestamps: true
})
tenantSchema.methods.generateAuthToken = async function () {
    return jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY, {expiresIn: "1 days"})
}

tenantSchema.methods.encryptPassword = async function () {
    this.password = await bcript.hash(this.password, 8)
    return this.password
}

const Tenant = new model("Tenant", tenantSchema)
module.exports = Tenant
