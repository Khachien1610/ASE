const Staff = require('../models/Staff');
const Customer = require('../models/Customer');
const Cart = require('../models/Cart');

const { mongooseToOject } = require('../../ulti/mongoose');
const { db } = require('../models/Cart');

class AccountMiddleware{

    async image(req, res, next){
        // // Set image
        var staff = await Staff.findOne({ idAccount: req.signedCookies.userId })
            .then( staff => staff );
        if(staff){
            staff = mongooseToOject(staff);
            res.locals.person = staff;
        }
        var customer = await Customer.findOne({ idAccount: req.signedCookies.userId })
            .then( customer => customer );
        if(customer){
            customer = mongooseToOject(customer);
            res.locals.person = customer;
        }
        next();
    }

    async count(req, res, next){
        var cart =  await Cart.findOne({ sessionId: req.signedCookies.sessionId });
        if(cart){
            cart = mongooseToOject(cart);
            var count = 0;
            for(const c of cart.cart){
                if(c){
                    count += c.count;
                }   
            }
            res.locals.count = count;
        }
        next();
    }

    async cart(req, res, next){
        // if(res.locals.person){
        //     var customerId = res.locals.person._id;
        //     var cart = await Cart.findOne({ customerId })
        //     if(!cart){
        //         cart = {
        //             sessionId: req.signedCookies.sessionId,
        //             cart: [],
        //             customerId
        //         }
        //     }
        //     cart = await new Cart(cart);
        //     cart.save();
        // }
        next();
    }
}

module.exports = new AccountMiddleware();