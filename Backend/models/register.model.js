const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullNames:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
        minLength: 8
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    }
},{
    timestamps: true
}
)

module.exports = mongoose.model("Trash2TreasureUsers",UserSchema)