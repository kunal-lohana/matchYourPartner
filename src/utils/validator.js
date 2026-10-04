const validator = require("validator");
const validateSignUpData = (reqData) => {
    const { firstName, lastName, email, password } = reqData;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    } else {
        if (!validator.isEmail(email)) {
            throw new Error("Email is not valid");
        } else {
            if (!validator.isStrongPassword(password)) {
                throw new Error("Enter Password is not strong!!");
            }
        }
    }
}

const validateLoginData = async (reqData) => {
    const { email = "", password = "" } = reqData || {};
    if (!email || !password) {
        throw new Error('Payload not available');
    }  else {
        if (!validator.isEmail(email)) {
            throw new Error("Email is not valid");
        } else {
            if (!validator.isStrongPassword(password)) {
                throw new Error("Enter Password is not strong!!");
            }
        }
    }

}

module.exports = { validateSignUpData, validateLoginData };