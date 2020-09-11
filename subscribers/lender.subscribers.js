const sgMail = require("../utils/email")

module.exports = {
     sendRegistrationEmail: async(lender) =>{
        const mail = {
            to: `${lender.email}`,
            from: 'sharedbox.tech@gmail.com',
            subject: `welcome ${lender.name} to SharedBox!`,
            text: `thanks ${lender.name} for registring to SharedBox`,
            html: '<strong>hope you have fun!!!</strong>',
        }
        try{   
           await sgMail.send(mail)
        }catch(err){
            console.log(err)
        }
    }
}