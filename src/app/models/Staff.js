const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Staff = new Schema({
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  gender: { type: String },
  address: { type: String },
  birthday: { type: String },
  idAccount: { type: String },
  delete: {type: Boolean},
  image: { type: String }
},{
  timestamps: true,
});


module.exports = mongoose.model('Staff', Staff);

