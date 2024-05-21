const mongoose = require("mongoose");

const Userschema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["Admin", "Manager"],
            default: "Admin"
        },
        lastSeen: {
            type: String // Store the formatted date string
        }
    },
    { timestamps: true }
);

const User = mongoose.model('User', Userschema);

module.exports = User;
