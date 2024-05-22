const express = require("express");
const colors = require("colors");
const Connecttodb = require("./Database/Connecttodb");
const dotenv = require('dotenv')
const auth = require('./Router/auth.routes')
const staff = require('./Router/staff.routes')
const report = require('./Router/report.routes')
const attendance = require('./Router/attendence.routes')
const cors = require('cors')
const screenshot = require('screenshot-desktop');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const Attendance = require("./Modals/attendence.modal");
const Staff = require("./Modals/staff.modal");
const moment = require('moment-timezone');






const app = express()
app.use(express.json());
app.set('trust proxy', 1);
const allowedOrigins = ['http://localhost:5173', 'https://webprof.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
dotenv.config();

// const captureScreenshot = async () => {
//     try {
//       const imgPath = path.join(__dirname, 'screenshots', `screenshot-${Date.now()}.jpg`);
//       const img = await screenshot({ format: 'jpg' });
//       fs.writeFileSync(imgPath, img);
//       console.log('Screenshot saved:', imgPath);
//     } catch (err) {
//       console.error('Failed to capture screenshot:', err);
//     }
//   };

//   const getRandomMinute = () => Math.floor(Math.random() * 60);

// cron.schedule('0 * * * *', () => {
//   const randomMinute = getRandomMinute();
//   console.log(`Scheduled screenshot at minute: ${randomMinute}`);
//   setTimeout(captureScreenshot, randomMinute * 60 * 1000);
// });
// console.log('Screenshot scheduler started.');


// Function to capture screenshot
// const captureScreenshot = async () => {
//     try {
//       const imgPath = path.join(__dirname, 'screenshots', `screenshot-${Date.now()}.jpg`);
//       const img = await screenshot({ format: 'jpg' });
//       fs.writeFileSync(imgPath, img);
//       console.log('Screenshot saved:', imgPath);
//     } catch (err) {
//       console.error('Failed to capture screenshot:', err);
//     }
//   };

//   // Function to get a random delay within 15 seconds
//   const getRandomDelay = () => Math.floor(Math.random() * 15000);

//   // Schedule the screenshot task every 15 seconds with a random delay
//   setInterval(() => {
//     const randomDelay = getRandomDelay();
//     console.log(`Next screenshot in ${randomDelay / 1000} seconds`);

//     setTimeout(captureScreenshot, randomDelay);
//   }, 15000);

//   console.log('Screenshot scheduler started.');

const markAbsentees = async () => {
    try {
        const currentDate = moment().tz('Asia/Karachi').format('YYYY-MM-DD');
        const staffList = await Staff.find();

        for (const staff of staffList) {
            const attendanceRecord = await Attendance.findOne({
                staffId: staff._id,
                date: currentDate
            });

            if (!attendanceRecord) {
                const newAttendance = new Attendance({
                    staffId: staff._id,
                    staffName: staff.name,
                    date: currentDate,
                    checkInTime: 'Not Applicable',
                    status: 'Absent',
                    timelinessStatus: 'Not Applicable',
                });

                await newAttendance.save();
            }
        }

        console.log("Absent status marked for non-present staff");
    } catch (error) {
        console.error("Error marking absentees:", error.message);
    }
};

// // Run markAbsentees every 10 seconds
// setInterval(markAbsentees, 10000);


// markAbsentees()

// cron.schedule('0 15 * * *', async () => { // runs daily at 3 PM
//     console.log("Running the absentee marking job...");
//     try {
//       await markAbsentees();
//       console.log("Absentee marking job completed successfully.");
//     } catch (error) {
//       console.error("Error running absentee marking job:", error);
//     }
//   });

cron.schedule('01 15 * * *', async () => {
    console.log("Running the absentee marking job...");
    try {
        await markAbsentees();
        console.log("Absentee marking job completed successfully.");
    } catch (error) {
        console.error("Error running absentee marking job:", error);
    }
}, {
    timezone: "Asia/Karachi"
});





app.use('/api/v1/auth', auth)
app.use('/api/v1/staff', staff)
app.use('/api/v1/report', report)
app.use('/api/v1/attendence', attendance)




const PORT = process.env.PORT || 3000


app.listen(PORT, () => {
    Connecttodb()
    console.log(`Server is Running at PORT ${PORT}`.bgBlue)
})
