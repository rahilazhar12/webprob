const allowedIP = "39.37.155.224";

const checkIP = (req, res, next) => {
    const requestIP = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;

    console.log('Request IP:', requestIP);

    if (requestIP === allowedIP) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Unauthorized IP address' });
    }
};

module.exports = checkIP;
