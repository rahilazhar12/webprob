const Staff = require('../Modals/staff.modal')
const Attendance = require('../Modals/attendence.modal')




const markAttendance = async (req, res) => {
    const { staffId, date, status } = req.body;

    try {
        const staff = await Staff.findById(staffId);
        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        const attendance = new Attendance({
            staffId,
            date,
            status
        });

        const result = await attendance.save();
        return res.status(201).json({ message: "Attendance marked successfully", attendance: result });
    } catch (error) {
        return res.status(500).json({ message: "Error marking attendance", error: error.message });
    }
};

module.exports = { markAttendance }


// const getAttendanceByDate = async (req, res) => {
//     const { date } = req.query;

//     try {
//         const attendanceRecords = await Attendance.find({ date: new Date(date) }).populate('staffId', 'name');
//         return res.status(200).json({ attendance: attendanceRecords });
//     } catch (error) {
//         return res.status(500).json({ message: "Error fetching attendance", error: error.message });
//     }
// };

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
