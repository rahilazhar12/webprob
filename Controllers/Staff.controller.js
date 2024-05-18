const Staff = require('../Modals/staff.modal')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const Registerstaff = async (req, res) => {
    const {
        name, email, password, mobile, role,
        address, birthday, emergency, CNIC, bloodgroup,
        otherinformation, active
    } = req.body;

    // Check for required fields
    const requiredFields = { name, email, password, mobile, role, address, emergency, CNIC };
    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value) {
            return res.status(400).json({ message: `${key} is required` });
        }
    }

    try {
        // Check for existing email
        if (await Staff.findOne({ email })) {
            return res.status(400).json({ message: "Email Already Exists" });
        }

        // Check for existing mobile number
        if (await Staff.findOne({ mobile })) {
            return res.status(400).json({ message: "Mobile Number Already Exists" });
        }

        const hashed = await bcrypt.hash(password, 10)

        // Create new staff data
        const staffData = new Staff({
            name, email, password: hashed, mobile, role, address, birthday, emergency,
            CNIC, bloodgroup, otherinformation, active,
            profilePicture: req.file ? req.file.path : ''
        });

        // Save staff data
        const result = await staffData.save();
        return res.status(201).json({ message: "Staff Saved Successfully", staff: result });
    } catch (error) {
        return res.status(500).json({ message: "Error in Connection", error: error.message });
    }
};

const staffLogin = async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await Staff.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid Email" });
    }

    // Check if user is active
    if (user.active !== "Active") {
        return res.status(403).json({ message: "You are inactive" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Login Failed" });
    }

    // Create JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Send response
    return res.status(200).json({
        message: "Login Successful",
        email: user.email,
        role: user.role,
        name: user.name,
        id: user._id,
        token
    });
}

const getallStaff = async (req, res) => {
    try {
        const staff = await Staff.find().select('name');
        return res.send({ staff });
    } catch (error) {
        return res.status(500).send({ message: "Error fetching staff", error });
    }
};



module.exports = { Registerstaff, staffLogin, getallStaff }
