const express = require('express')
const { Registerstaff, staffLogin, getallStaff } = require('../Controllers/Staff.controller')
const upload = require('../Helper/Multer')



const router = express.Router()

router.post('/staff-register', upload.single('profilePicture'), Registerstaff)
router.post('/staff-login', staffLogin)
router.get('/get-allstaff', getallStaff)


module.exports = router