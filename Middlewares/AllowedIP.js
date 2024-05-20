const requestIp = require('request-ip');

const allowedIP = "59.103.75.183";

const checkIP = (req, res, next) => {
    const clientIp = requestIp.getClientIp(req); 

    console.log('Client IP:', clientIp);

    if (clientIp === allowedIP) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Unauthorized IP address' });
    }
};

module.exports = checkIP;
