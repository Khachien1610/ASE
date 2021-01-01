const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Bill = new Schema({
    orderId: { type: String },
    customerId: { type: String },
    staffId: { type: String }
},{
  timestamps: true,
});

//Add plugins
Bill.plugin(mongooseDelete, { 
  overrideMethods: 'all',   
  deletedAt : true,
});


module.exports = mongoose.model('Bill', Bill);

