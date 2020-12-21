const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Provider = new Schema({
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
},{
  timestamps: true,
});

//Add plugins
Provider.plugin(mongooseDelete, { 
  overrideMethods: 'all',   
  deletedAt : true,
});


module.exports = mongoose.model('Provider', Provider);

