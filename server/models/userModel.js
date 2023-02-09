const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
})
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;






