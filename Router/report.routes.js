const express = require('express')
const { Staffreport, getReportsByDateAndStaff } = require('../Controllers/report.controller')



const router = express.Router()

router.post('/staff-report', Staffreport)
router.get("/get-staffreport", getReportsByDateAndStaff);


module.exports = router