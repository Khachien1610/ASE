const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Student = new Schema({
    name: { type: String },
    age: { type: Number },
})

module.exports = mongoose.model('Student', Student);
