const Lender = require("../models/lender.model")
const Tenant = require("../models/tenant.model")
const jwt = require("jsonwebtoken")
const Busboy = require('busboy')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const authMiddleware = async function( req, res, next){
    const token = req.headers["authorization"] ? req.headers["authorization"].replace("Bearer ", "") : null    
    const userType = req.headers["x-usertype"] ? req.headers["x-usertype"] : "lender"
    try{
        const userId = jwt.verify(token, process.env.SECRET_KEY)
        const user =  userType === "lender" ? await Lender.findOne({_id: userId}) : await Tenant.findOne({_id: userId})
        if(!user) return res.status(404).json("the user asigned to this token can no longer be found. Please verify if the account still exist")
        req.user = user
        req.token = token
        next()
    }catch(err){
        if(token){
            const user =  userType === "lender" ? await Lender.findOne({tokens:token}) : await Tenant.findOne({tokens:token})
            const newTokens = user.tokens.filter(t=>{
                return t !== token
            })
            userType === "lender" ? await Lender.updateOne({_id:user._id},{tokens:newTokens}) : await Tenant.updateOne({_id:user._id},{tokens:newTokens})
        }
        if(err) res.status(401).json("the user is not authorized. Please provide a valid token to proceed")
    }  
}

const photosMiddleware = (req, res , next) => {
    let counter = 0;
    const done = () => {
        if(counter > 0) return
        next()
    };

    const busboy = new Busboy({headers: req.headers});

    req.body = {};

    busboy.on('field', (key,value) => {
        req.body[key] = value;
    });
    busboy.on('file', (key,file) => {
        counter++
        const stream = cloudinary.uploader.upload_stream(
            { upload_preset : 'sharedBox'},
            (err,res) => {
                counter--
                if(err) throw "Something went wrong";

                req.body[`${key}-${counter}`] = res;
                done()
            }
        );

        file.on('data',(data) => {
            stream.write(data)
        });
        
        file.on('end',() => {
            stream.end()
        });
    });

    busboy.on('finish', () => {
        done();
    });

    req.pipe(busboy);
}

module.exports = {
    authMiddleware,
    photosMiddleware
}