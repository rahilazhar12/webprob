const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'staff',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    report: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

 const Reports = mongoose.model("Report", reportSchema);
 
 module.exports = Reports