const Staff = require('../Modals/staff.modal')
const Attendance = require('../Modals/attendence.modal')
const moment = require('moment-timezone');




// const markAttendance = async (req, res) => {
//     const { staffId, date, status } = req.body;

//     try {
//         // Check if attendance already marked for this staff on the given date
//         const existingAttendance = await Attendance.findOne({ staffId, date });
//         if (existingAttendance) {
//             return res.status(400).json({ message: "Attendance already marked for this staff on this date" });
//         }

//         const staff = await Staff.findById(staffId);
//         if (!staff) {
//             return res.status(404).json({ message: "Staff not found" });
//         }

//         const currentTime = moment().tz('Asia/Karachi');
//         const currentTimeString = currentTime.format('hh:mm:ss A');
//         const timelinessStatus = currentTime.hour() > 12 || (currentTime.hour() === 12 && currentTime.minute() > 10) ? 'Late' : 'On Time';

//         const attendance = new Attendance({
//             staffId,
//             staffName: staff.name,
//             date,
//             time: currentTimeString,
//             status,
//             timelinessStatus
//         });

//         const result = await attendance.save();
//         return res.status(201).json({ message: "Attendance marked successfully", attendance: result });
//     } catch (error) {
//         return res.status(500).json({ message: "Error marking attendance", error: error.message });
//     }
// };


const markAttendance = async (req, res) => {
    const { staffId, date, status, type } = req.body; // Added 'type' to distinguish between check-in and check-out

    try {
        const staff = await Staff.findById(staffId);
        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        const currentTime = moment().tz('Asia/Karachi');
        const currentTimeString = currentTime.format('hh:mm:ss A');
        const timelinessStatus = currentTime.hour() > 12 || (currentTime.hour() === 12 && currentTime.minute() > 10) ? 'Late' : 'On Time';

        if (type === 'check-in') {
            // Check if attendance already marked for this staff on the given date
            const existingAttendance = await Attendance.findOne({ staffId, date });
            if (existingAttendance) {
                return res.status(400).json({ message: "Check-in already marked for this staff on this date" });
            }

            const attendance = new Attendance({
                staffId,
                staffName: staff.name,
                date,
                checkInTime: currentTimeString,
                status,
                timelinessStatus
            });

            const result = await attendance.save();
            return res.status(201).json({ message: "Check-in marked successfully", attendance: result });

        } else if (type === 'check-out') {
            // Check if check-out is already marked for this staff on the given date
            const attendance = await Attendance.findOne({ staffId, date });
            if (!attendance) {
                return res.status(404).json({ message: "Check-in record not found for this staff on this date" });
            }

            if (attendance.checkOutTime) {
                return res.status(400).json({ message: "Check-out already marked for this staff on this date" });
            }

            attendance.checkOutTime = currentTimeString;

            const checkInTime = moment(attendance.checkInTime, 'hh:mm:ss A');
            const checkOutTime = moment(attendance.checkOutTime, 'hh:mm:ss A');
            const duration = moment.duration(checkOutTime.diff(checkInTime));
            const hours = parseInt(duration.asHours());
            const minutes = parseInt(duration.asMinutes()) % 60;
            attendance.totalWorkingHours = `${hours}h ${minutes}m`;

            const result = await attendance.save();
            return res.status(200).json({ message: "Check-out marked successfully", attendance: result });
        } else {
            return res.status(400).json({ message: "Invalid type specified" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error marking attendance", error: error.message });
    }
};

const getAttendanceByDate = async (req, res) => {
    const { date } = req.query;

    try {
        const attendanceRecords = await Attendance.find({ date: new Date(date) }).populate('staffId', 'name');
        return res.status(200).json({ attendance: attendanceRecords });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching attendance", error: error.message });
    }
};



module.exports = { markAttendance, getAttendanceByDate }


// const getAttendanceByMonth = async (req, res) => {
//     const { month, year } = req.query;

//     try {
//         const startDate = new Date(year, month - 1, 1);
//         const endDate = new Date(year, month, 0);

//         const attendanceRecords = await Attendance.find({
//             date: { $gte: startDate, $lte: endDate }
//         }).populate('staffId', 'name');

//         return res.status(200).json({ attendance: attendanceRecords });
//     } catch (error) {
//         return res.status(500).json({ message: "Error fetching attendance", error: error.message });
//     }
// };

// const getAttendanceByYear = async (req, res) => {
//     const { year } = req.query;

//     try {
//         const startDate = new Date(year, 0, 1);
//         const endDate = new Date(year, 11, 31);

//         const attendanceRecords = await Attendance.find({
//             date: { $gte: startDate, $lte: endDate }
//         }).populate('staffId', 'name');

//         return res.status(200).json({ attendance: attendanceRecords });
//     } catch (error) {
//         return res.status(500).json({ message: "Error fetching attendance", error: error.message });
//     }
// };

// module.exports = { markAttendance, getAttendanceByDate, getAttendanceByMonth, getAttendanceByYear };
