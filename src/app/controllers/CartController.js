const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

const { mongooseToOject, multipleMongooseToObject } = require('../../ulti/mongoose');

class CartController{

    // [POST] /cart/:id
    async create(req, res, next){
        var sessionId = req.signedCookies.sessionId;
        var cart, x = 1;
        var cartCheck = await Cart.findOne({ sessionId });
        if(!cartCheck){
            cart = {
                sessionId: sessionId,
                cart: [
                    {
                        productId: req.params.id,
                        count: 1
                    }
                ]
            }
            cart = new Cart(cart);
            cart
                .save(()=> {
                    res.redirect('back');
                })
        }else{
            cartCheck = mongooseToOject(cartCheck);
            for(const c of cartCheck.cart){
               if(c){
                if(c.productId == req.params.id ){
                    ++c.count;
                    x = 0;
                }else{
                    cart = {
                        productId: req.params.id,
                        count: 1    
                    }
                }
               }
            }
            if(x){
                 cartCheck.cart.push(cart);
            }
            Cart.updateOne({ sessionId }, cartCheck )
                .then(res.redirect('back'))
                .catch()
        }
    }

    async show(req, res, next){
        var cart = await Cart.findOne({ sessionId: req.signedCookies.sessionId })
            .then( cart => cart )
        var sum = 0;
        if(cart){
            cart = mongooseToOject(cart);
            var cartFilter = cart.cart;
            var cartSuccess = [];
            for(const c of cartFilter){
                var id = c.productId;
                var product;
                if (id.match(/^[0-9a-fA-F]{24}$/)) {
                    product = await Product.findOne({ _id: id });
                    if(product){
                        product = mongooseToOject(product);
                        var cost = product.cost, sale = product.sale;
                        if(sale != 0){
                            cost = cost - cost*sale/100;
                        }
                        sum += cost*c.count;
                        cartSuccess.push({
                            id: product._id,
                            sale: product.sale,
                            cost: product.cost,
                            slug: product.slug,
                            name: product.name,
                            count: c.count,
                            afterSale: cost*c.count,
                        });
                    }
                }
            }
        }
        res.render('cart/show',{
            cartSuccess,
            sum,
            userId: req.signedCookies.userId
        });
    }

    async down(req, res, next){
        var sessionId = req.signedCookies.sessionId;
        var cart = await Cart.findOne({ sessionId })
        .then( cart => cart )
        if(cart){
            cart = mongooseToOject(cart);
            cart = cart.cart;
            var newCart = [];
            for(const c of cart){
                if(c.productId == req.params.id){
                    --c.count;
                    if(c.count < 1){
                        res.redirect('back');
                    }
                }
                newCart.push(c);
            }
            Cart.updateOne({ sessionId }, { cart: newCart} )
                .then(res.redirect('back'))
                .catch()
        }
    }

    async up(req, res, next){
        var sessionId = req.signedCookies.sessionId;
        var cart = await Cart.findOne({ sessionId })
        .then( cart => cart )
        if(cart){
            cart = mongooseToOject(cart);
            cart = cart.cart;
            var newCart = [];
            for(const c of cart){
                if(c.productId == req.params.id){
                    ++c.count;
                    if(c.count == 11){
                        res.redirect('back');
                    }
                }
                newCart.push(c);
            }
            Cart.updateOne({ sessionId }, { cart: newCart} )
                .then(res.redirect('back'))
                .catch()
        }
    }

    async delete(req, res, next){
        var sessionId = req.signedCookies.sessionId;
        var cart = await Cart.findOne({ sessionId })
        .then( cart => cart )
        if(cart){
            cart = mongooseToOject(cart);
            cart = cart.cart;
            var newCart = [];
            for(const c of cart){
                if(c.productId != req.params.id){
                    newCart.push(c);
                }
            }
            if(newCart.length == 0){
                res.clearCookie('sessionId');
                await Cart.deleteOne({sessionId});
            }
            Cart.updateOne({ sessionId }, { cart: newCart} )
                .then(res.redirect('back'))
                .catch()
        }
    }

    async check(req, res, next){
        var cart = await Cart.findOne({ sessionId: req.signedCookies.sessionId });
        if(cart){
            cart = mongooseToOject(cart);
            cart.customerId = req.signedCookies.userId;
            await Cart.updateOne({ sessionId: req.signedCookies.sessionId }, cart );
            
            var cartSuccess = [], sum = 0, sumPoint;
            for(const c of cart.cart){
                var id = c.productId;
                if (id.match(/^[0-9a-fA-F]{24}$/)) {
                    var product= await Product.findOne({ _id: id });
                    if(product){
                        product = mongooseToOject(product);
                        var cost = product.cost, sale = product.sale;
                        if(sale != 0){
                            cost = cost - cost*sale/100;
                        }
                        sum += cost*c.count;
                        cartSuccess.push({
                            name: product.name,
                            count: c.count,
                        });
                    }
                }
            }
        }
        var customer = res.locals.person;
        sumPoint = sum - customer.point*1000;
        res.render('cart/check',{
            cartSuccess,
            customer,
            sum,
            sumPoint
        });
    }

    checkPost(req, res, next){
        res.json('Test');
    }

}

module.exports = new CartController();
