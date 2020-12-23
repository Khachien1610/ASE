const Product = require('../models/Product');
const Cart = require('../models/Cart');

const { mongooseToOject } = require('../../ulti/mongoose');

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
                .save(res.redirect('back'))
                .then()
                .catch()
        }else{
            cartCheck = mongooseToOject(cartCheck);
            for(const c of cartCheck.cart){
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
        if(cart){
            cart = mongooseToOject(cart);
            var cartFilter = cart.cart;
            var cartSuccess = [];
            for(const cart of cartFilter){
                var product = await Product.findOne({ _id: cart.productId }).then(product=>product);
                product = mongooseToOject(product);
                cartSuccess.push({
                    id: product._id,
                    cost: product.cost,
                    slug: product.slug,
                    name: product.name,
                    count: cart.count
                });
            }
        }
        res.render('cart/show',{
            cartSuccess
        });
    }
}

module.exports = new CartController();