const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Account = new Schema({
    username: { 
        type: String,
        unique: true,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    role: { type: String },
},{
    timestamps: true,
});

//Add plugins
Account.plugin(mongooseDelete, { 
    overrideMethods: 'all',   
    deletedAt : true,
});

module.exports = mongoose.model('Account', Account);

