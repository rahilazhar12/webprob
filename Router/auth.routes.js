const express = require('express')
const { Adminregister, Adminlogin } = require('../Controllers/auth.controller')

const router = express.Router()

router.post('/register', Adminregister)
router.post('/admin-login', Adminlogin)


module.exports = router