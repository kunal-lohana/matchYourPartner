const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,        
        
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        lowercase: true,
        trim: true
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
        type: String

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