const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff',
        required: true,
    },
    staffName: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    checkInTime: {
        type: String,
        required: true,
    },
    checkOutTime: {
        type: String,
    },
    totalWorkingHours: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Leave'],
        required: true,
    },
    timelinessStatus: {
        type: String,
        enum: ['On Time', 'Late' , 'Not Applicable'],
        required: true,
    }
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
