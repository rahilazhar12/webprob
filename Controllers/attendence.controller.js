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


const getAttendanceByMonth = async (req, res) => {
    const { month, year } = req.query;

    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const attendanceRecords = await Attendance.find({
            date: { $gte: startDate, $lte: endDate }
        }).populate('staffId', 'name');

        return res.status(200).json({ attendance: attendanceRecords });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching attendance", error: error.message });
    }
};


// const getAttendanceByDateRange = async (req, res) => {
//     const { startDate, endDate } = req.query;

//     try {
//         const start = new Date(startDate);
//         const end = new Date(endDate);

//         const attendanceRecords = await Attendance.find({
//             date: { $gte: start, $lte: end }
//         }).populate('staffId', 'name');

//         return res.status(200).json({ attendance: attendanceRecords });
//     } catch (error) {
//         return res.status(500).json({ message: "Error fetching attendance", error: error.message });
//     }
// };

const getAttendanceByDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const attendanceRecords = await Attendance.find({
            date: { $gte: start, $lte: end }
        }).populate('staffId', 'name');

        // Aggregate data by staff
        const aggregatedData = {};

        attendanceRecords.forEach(record => {
            const { staffId, status, totalWorkingHours, timelinessStatus } = record;
            if (!aggregatedData[staffId._id]) {
                aggregatedData[staffId._id] = {
                    name: staffId.name,
                    present: 0,
                    absent: 0,
                    leave: 0,
                    totalWorkingHours: 0,
                    onTime: 0,
                    late: 0
                };
            }

            if (status === 'Present') {
                aggregatedData[staffId._id].present += 1;
            } else if (status === 'Absent') {
                aggregatedData[staffId._id].absent += 1;
            } else if (status === 'Leave') {
                aggregatedData[staffId._id].leave += 1;
            }

            if (timelinessStatus === 'On Time') {
                aggregatedData[staffId._id].onTime += 1;
            } else if (timelinessStatus === 'Late') {
                aggregatedData[staffId._id].late += 1;
            }

            if (totalWorkingHours) {
                try {
                    // Convert workingHours string to total minutes
                    const [hoursStr, minutesStr] = totalWorkingHours.split(' ');
                    const hours = parseInt(hoursStr.replace('h', '')) || 0;
                    const minutes = parseInt(minutesStr.replace('m', '')) || 0;
                    const totalMinutes = (hours * 60) + minutes;

                    // Add the total minutes to totalWorkingHours
                    aggregatedData[staffId._id].totalWorkingHours += totalMinutes;
                } catch (err) {
                   console.log(err)
                }
            }
        });

        // Convert total working hours from minutes to hours and minutes
        Object.keys(aggregatedData).forEach(key => {
            const totalMinutes = aggregatedData[key].totalWorkingHours;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            aggregatedData[key].totalWorkingHours = `${hours}h ${minutes}m`;
        });

        // Convert aggregated data to array
        const attendanceSummary = Object.keys(aggregatedData).map(key => ({
            staffId: key,
            ...aggregatedData[key]
        }));

        return res.status(200).json({ attendance: attendanceSummary });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching attendance", error: error.message });
    }
};












module.exports = { markAttendance, getAttendanceByDate, getAttendanceByMonth, getAttendanceByDateRange }




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
