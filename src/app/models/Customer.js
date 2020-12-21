const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Customer = new Schema({
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  gender: { type: String },
  address: { type: String },
  birthday: { type: String },
  idAccount: { type: String },
  point: { type: Number },
  delete: {type: Boolean},
  image: { type: String }
},{
  timestamps: true,
});


module.exports = mongoose.model('Customer', Customer);

