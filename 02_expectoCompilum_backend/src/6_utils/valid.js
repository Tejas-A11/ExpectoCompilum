const validator = require('validator');
const valid = (data)=> {
    const mandatory = ['firstName', 'emailId', 'password'];
    const isValid = mandatory.every((k)=>Object.keys(data).includes(k));
    if(!isValid) throw new Error("required fields missing");
    if(!validator.isEmail(data.emailId)) throw new Error("invalid email");
    if(!validator.isStrongPassword(data.password)) throw new Error("Weak password")
}
module.exports = valid;