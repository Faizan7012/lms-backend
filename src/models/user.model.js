const { Schema, model } = require("mongoose");

const userSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
        enum : ['user' ,'admin']
    },
    course: [ { type:Schema.Types.ObjectId, ref: 'course', required: true  , default :[]}],
}, { timestamp: true });

const userModel = model("user", userSchema);

module.exports = userModel