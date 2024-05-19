const express = require("express");
const colors = require("colors");
const Connecttodb = require("./Database/Connecttodb");
const dotenv = require('dotenv')
const auth = require('./Router/auth.routes')
const staff = require('./Router/staff.routes')
const report = require('./Router/report.routes')
const cors = require('cors')



const app = express()
app.use(express.json());
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

app.use('/api/v1/auth', auth)
app.use('/api/v1/staff', staff)
app.use('/api/v1/report', report)




const PORT = process.env.PORT || 3000


app.listen(PORT, () => {
    Connecttodb()
    console.log(`Server is Running at PORT ${PORT}`.bgBlue)
})
