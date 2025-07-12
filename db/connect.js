// @ts-check

const mongoose = require('mongoose');


/**
 * Connect to Db
 * @param {string} uri Mongo string connection
 */
const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log('Successfully connect to Mongo')
    } catch (error) {
        console.error('An error occurred to connection', error?.message)
        process.exit(1)
    }
};

module.exports = connectDB;