const { Schema , model } = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const {emailValidators, passwordValidators} = require ("../utils/validators")


const lenderSchema = new Schema ({
    name:{
        type: String,
        trim: true,
        uppercase: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        validate: emailValidators("Lender")
    },
    password: {
        type: String,
        required: true,
        validate: passwordValidators.bind(this)
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 13,
        trim: true
    },
    passwordIsEncrypted:{
        type: Boolean,
        default: false
    },
    scores:{
        type:[{type: Schema.Types.ObjectId, ref:"Score"}] 
    },
    averageScore:{
        type: Number,
        default: 0
    },
    notifications: {
        type: [{type: Schema.Types.ObjectId, ref:"Notification"}]
    },
    spaces: {
        type: [Schema.Types.ObjectId],
        ref: "spaces"
    },
    tokens : [
        {
        type: String,
        }
    ],
    country:{
        type: String,
        default: "Colombia"
    },
    city: {
        type: String
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    subscriptionId: {
        type: String    
    },    
    endpoint: {
        type: String    
    },
    p256dh: {
        type: String    
    },
    auth: {
        type: String    
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    profilePhoto: {
        type: String
    }
},{
    timestamps: true
})

lenderSchema.methods.generateAuthToken = async function () {
    return jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY, {expiresIn: "1 days"})
}

lenderSchema.methods.encryptPassword = async function () {
    this.password = await bcrypt.hash(this.password, 8)
    return this.password
}

lenderSchema.methods.getPublicData = function () {
    return (({name, email, tokens, tasks}) => ({name, email, tokens, tasks}))(this) 
}

const Lender = new model("Lender", lenderSchema)

module.exports = Lender