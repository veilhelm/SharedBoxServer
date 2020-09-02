const {Schema , model} =require('mongoose')
const bycript = require('bcrypt')
const jwt =require('jsonwebtoken')
const validator = require('validator')
 
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
        unique:true,
        validator(value){
            if(!validator.isEmail(value)) return false
        },
        message: "the email provided is not a valid email"
    },
    password:{
        type:String,
        require:true,
        validate: {
            validator(value){
                if(this.email.split(/\.|\@|_|-/g).some(word => value.includes(word) && word !== "com" ) || value.length < 6 || !/\d/.test(value)) return false
            },
            message: "password must be 6 characters long, contain at least one digit number and cannot contain words used in the email"
        }
    },
    phoneNumber:{
        type:String,
        trim:true,
        require:true,
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
    ]
})
tenantSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY, {expiresIn: "1 days"})
    this.tokens = this.tokens.concat(token)
    await this.save()
    return token
}
tenantSchema.pre("save", async function(){
    if(!this.passwordIsEncrypted){
        this.password = await bycript.hash(this.password, 8)
        this.passwordIsEncrypted = true
    }
})
const Tenant = new model("Tenant", tenantSchema)
module.exports = Tenant
