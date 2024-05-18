const mongoose = require("mongoose");

const Connecttodb = async () => {
    const Mongoose_URI = process.env.Mongoose_URI
    try {
        await mongoose.connect(Mongoose_URI);
        console.log(`Database is Connected`.green.bgGreen);
    } catch (error) {
        console.log(`Db Error ${error.message}`);
    }
};

module.exports = Connecttodb;
