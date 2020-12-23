const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;
const cartSchema  = new Schema({
    productId: { type: String },
    count: { type: Number }
})

const Cart = new Schema({
    sessionId: { type: String },
    cart: [cartSchema]
},{
    timestamps: true,
});

module.exports = mongoose.model('Cart', Cart);

