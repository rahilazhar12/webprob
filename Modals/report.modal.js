const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    startTime: {
        type: String,  // Changed to String
        required: true
    },
    endTime: {
        type: String,  // Changed to String
        required: true
    },
    totalTime: {
        type: String,
        default: "0 hours 0 minutes"
    }
}, { _id: false });

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
    tasks: [taskSchema]
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
