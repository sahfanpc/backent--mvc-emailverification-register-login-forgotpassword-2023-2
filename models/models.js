const mongoose = require('mongoose');
const userschema = mongoose.Schema({
    fname: {
        type: String,
        required: true,
        maxlength: 32,
        trin: true
    },
    lname: {
        type: String,
        required: true,
        trin: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trin: true
    },
    phonecode: {
        type: Number,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // conformpassword: {
    //     type: String,
    //     required: true
    // },
    token: {
        type: String,
        default: ''
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    }

}, { timestamps: true }
)
module.exports = User = mongoose.model("User", userschema)