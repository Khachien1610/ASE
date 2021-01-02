const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const cartSchema  = new Schema({
    productId: { type: String },
    count: { type: Number },
    cost: { type: Number },
    sale: { type: Number }
})

const Order = new Schema({
    cart: [cartSchema],
    point: { type: Number },
    payment: { type: String },
    total: { type: Number },
    remainder: { type: Number },
    process: { type: Boolean },
    idCustomer: { type: String },
    ship: { type: Number },
},{
  timestamps: true,
});

//Add plugins
Order.plugin(mongooseDelete, { 
  overrideMethods: 'all',   
  deletedAt : true,
});


module.exports = mongoose.model('Order', Order);

