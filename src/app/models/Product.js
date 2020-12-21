const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const changeSchema = new Schema({
  cost: { type: Number },
  sale: { type: Number },
  date: { type: Date, default: Date.now }
})

const Product = new Schema({
  name: { type: String },
  image: { type: String },
  description: { type: String },
  provider: { type: String }, 
  updatedUser:  { type: String },
  updatedReason: { type: String },
  cost: { type: Number },
  sale: { type: Number},
  saleAt: { type: Date },
  saleUser: { type: String },
  saleReason: { type: String },
  slug: { 
    type: String, 
    slug: "name", 
    unique: true
  },
  images: { type: Array },
  change: [changeSchema] 
},{
  timestamps: true,
});

// Add plugins
mongoose.plugin(slug);
Product.plugin(mongooseDelete, { 
  overrideMethods: 'all',   
  deletedAt : true,
});

module.exports = mongoose.model('Product', Product);

