const Lender = require("../models/lender.model")
const jwt = require("jsonwebtoken")
const Busboy = require('busboy')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const authMiddleware = async function( req, res, next){
    const token = req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null
    try{
        const lenderId = jwt.verify(token, process.env.SECRET_KEY)
        const lender = await Lender.findOne({_id: lenderId})
        if(!lender) return res.status(404).json("the user asigned to this token can no longer be found. Please verify if the account still exist")
        req.lender = lender
        req.token = token
        next()
    }catch(err){
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