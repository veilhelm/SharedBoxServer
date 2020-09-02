const { Schema , model } = require("mongoose")
const jwt = require("jsonwebtoken")
const bcript = require("bcrypt")
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
        validate: emailValidators
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
        type: [Schema.Types.ObjectId],
        ref: "Score"
    },
    averageScore:{
        type: Number,
        default: 0
    },
    notifications: {
        type: Schema.Types.ObjectId,
        ref: "Notification"
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
    }
},{
    timestamps: true
})

lenderSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY, {expiresIn: "1 days"})
    this.tokens = this.tokens.concat(token)
    await this.save()
    return token
}

lenderSchema.methods.getPublicData = function () {
    return (({name, email, tokens, tasks}) => ({name, email, tokens, tasks}))(this) 
}

lenderSchema.pre("save", async function(){
    if(!this.passwordIsEncrypted){
        this.password = await bcript.hash(this.password, 8)
        this.passwordIsEncrypted = true
    }
})

const Lender = new model("Lender", lenderSchema)

module.exports = Lender