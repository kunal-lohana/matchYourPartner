const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Enter Strong Password ");
            }
        }
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid Email Address :"+value);
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!['male', 'female', 'others'].includes(value)) {
                throw new Error("Gender is not valid!");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZvIR3JcAsDXouJzsWk04xRF08hEhhtGBmGn5boHLEBg&s",
        validate(value) {
           if(!validator.isURL(value)) {
                throw new Error("Invalid photo url");
            }
        }

    },
    about: {
        type: String,
        default: 'This is default about the user!'
    },
    skills: {
        type: [String],
        validate(value) {
            if(!(value.length <= 10)) {
                throw new Error('More than 10 skills not allowed !!');
            }
        }
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)