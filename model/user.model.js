// @ts-check

const mongoose = require('mongoose');


const LogsSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLenght: 3
    },
    logs: LogsSchema
});

const User = mongoose.model('User', UserSchema);

module.exports = User;