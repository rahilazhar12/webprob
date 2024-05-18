const User = require('../Modals/user.modal')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const Adminregister = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send({ message: "Please fill all the fields" });
    }

    try {
        // Check existing email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ message: "User Already Exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword, role });

        // Save the new user
        const result = await newUser.save();
        return res.status(201).send({ message: "User Registered Successfully", role: result.role, email: result.email });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Server Error" });
    }
};


const Adminlogin = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).send({ message: "Email and password are required" });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "Invalid credentials" });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).send({ message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Send response
        return res.status(200).send({
            message: "Login successful",
                email: user.email,
                role: user.role,
                id: user._id,
                name: user.name,
                token: token
            

        });
    } catch (error) {
        // Handle unexpected errors
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}



module.exports = { Adminregister, Adminlogin }