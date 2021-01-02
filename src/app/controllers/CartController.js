const nodemailer = require('nodemailer');

const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Customer = require('../models/Customer');

const { mongooseToOject } = require('../../ulti/mongoose');

class CartController{

    // [POST] /cart/:id
    async create(req, res, next){
        var sessionId = req.signedCookies.sessionId;
        var cart, x = 1;
        var cartCheck = await Cart.findOne({ sessionId });
        if(!cartCheck){
            var id = req.params.id;
            var product;
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                product = await Product.findOne({ _id: id });
                if(product){
                    product = mongooseToOject(product);
                }
            }
            cart = {
                sessionId: sessionId,
                cart: [
                    {
                        productId: req.params.id,
                        count: 1,
                        cost: product.cost,
                        sale: product.sale
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
            var id = req.params.id;
            var product;
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                product = await Product.findOne({ _id: id });
                if(product){
                    product = mongooseToOject(product);
                }
            }
            for(const c of cartCheck.cart){
               if(c){
                if(c.productId == req.params.id ){
                    ++c.count;
                    x = 0;
                }else{
                    cart = {
                        productId: req.params.id,
                        count: 1,
                        cost: product.cost,
                        sale: product.sale    
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
        var ship;
        if(sum < 1000000){
            ship = 50000;
        }else{
            ship = 0;
        }
        var remainder;
        remainder = sum + ship;
        var customer = res.locals.person;
        res.render('cart/check',{
            cartSuccess,
            customer,
            sum,
            ship,
            remainder
        });
    }

    async checkPost(req, res, next){        
        var check = req.body;
        var customer = res.locals.person;
        if(check.check == 'checked'){
                check.point = parseInt(req.body.point);
                if(req.body.point < 0 || req.body.point > customer.point ){
                    res.redirect('back');
                    return;
                }
        }else{
                check.point = 0;
        }

        var cart = await Cart.findOne({ sessionId: req.signedCookies.sessionId });
        if(cart){
            cart = mongooseToOject(cart);
            cart.customerId = req.signedCookies.userId;
            await Cart.updateOne({ sessionId: req.signedCookies.sessionId }, cart );
            
            var cartSuccess = [], sum = 0;
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
                            productId: product._id,
                            count: c.count,
                            sale: product.sale,
                            cost: product.cost
                        });
                    }
                }
            }
        }
        var ship;
        if(sum < 1000000){
            ship = 50000;
        }else{
            ship = 0;
        }
        sum += ship;
        check.ship = ship;
        check.cart = cartSuccess;
        check.total = sum;
        check.process = false;
        check.idCustomer = customer._id;
        var pointNew = customer.point - check.point;
        if(check.point == 0){
            check.remainder = sum;
        }else{
            check.remainder = sum - check.point*1000;
        }
        var order = await new Order(check);
            order
                .save()
                .then( async () => {
                    await Cart.deleteOne({ sessionId: req.signedCookies.sessionId })
                        .then(() => res.redirect('/'))
                        .catch()
                })
        await Customer.updateOne({ _id: customer._id }, { point:pointNew });
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'testnodemailer0@gmail.com',
                pass: 'testnodemailer000',
            }
        });

        var content = '';
        content += `
            <h4>Đơn hàng của bạn đã được đặt thành công, vui lòng chờ nhân viên xác nhận!</h4>
        `;

        var mailOptions = {
            from: 'testnodemailer0@gmail.com',
            to: 'testnodemailer0@gmail.com',
            subject: 'ĐƠN HÀNG',
            html: content,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent:' + info.response);
            }
        });
    }
        
}

module.exports = new CartController();
