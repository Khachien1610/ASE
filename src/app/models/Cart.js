const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartSchema  = new Schema({
    productId: { type: String },
    count: { type: Number },
    cost: { type: Number },
    sale: { type: Number }
})

const Cart = new Schema({
    sessionId: { type: String },
    cart: [cartSchema],
    customerId: { type: String }
},{
    timestamps: true,
});

module.exports = mongoose.model('Cart', Cart);

