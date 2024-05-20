const express = require('express');
const { markAttendance, getAttendanceByDate } = require('../Controllers/attendence.controller');
const checkIP = require('../Middlewares/AllowedIP');


const router = express.Router();

router.post('/mark-attendance', checkIP, markAttendance);
router.get('/attendance/date', getAttendanceByDate);
// router.get('/attendance/month', getAttendanceByMonth);
// router.get('/attendance/year', getAttendanceByYear);

module.exports = router;
