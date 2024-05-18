const mongoose = require("mongoose");

const staffschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    adress: {
      type: String,
    },
    birthday: {
      type: String,
    },
    emergency: {
      type: String,
      required: true,
    },
    CNIC: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },

    bloodgroup: {
      type: String,
    },
    otherinformation: {
      type: String,
    },
    active: {
      type: String,
      default: "Active",
    },
    leadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Staff = mongoose.model("staff", staffschema);

module.exports = Staff;
