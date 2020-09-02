const validator = require('validator')
const {models} = require('mongoose')
const emailValidators = [
    {
        validator: (email) => validator.isEmail(email),
        message: "the email provided is not a valid email"
    },
    {
        validator:  async (email) =>!(await models.Tenant.findOne({email})),
        message: "the email provided is already registered"
    }
]

const passwordValidators = function() {
    return [
            {
                validator: (value) => {if(this.email.split(/\.|\@|_|-/g).some(word => value.includes(word) && word !== "com" ) || value.length < 6 || !/\d/.test(value)) return false},
                message: "password must be 6 characters long, contain at least one digit number and cannot contain words used in the email"
            }
        ]
}


module.exports = {
    emailValidators,
    passwordValidators
}