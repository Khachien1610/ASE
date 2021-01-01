
const Order = require('../models/Order');
const Product = require('../models/Product');
const Bill = require('../models/Bill');

const { mongooseToOject } = require('../../ulti/mongoose');

class OrderController{

    async show(req, res, next){
        var id = req.params.id;
        var order = await Order.findOne({ _id: id});
        order = mongooseToOject(order);
        var orderSuccess = [];
        var sum = 0;
        for(const o of order.cart){
            var product = await Product.findOne({ _id: o.productId });
            product = mongooseToOject(product);
            if(product.sale == 0){
                sum += product.cost*o.count;
            }else{
                sum += (product.cost-product.cost*product.sale/100) * o.count;
            }
            orderSuccess.push({
                name: product.name,
                count: o.count,
                sale: product.sale,
                cost: product.cost,
                afterSale: (product.cost-product.cost*product.sale/100) * o.count,
            })
        }
        res.render('order/show',{
            orderSuccess,
            sum
        });
    }

    async delete(req, res, next){
        Order.deleteOne({ _id : req.params.id})
            .then(res.redirect('back'))
            .catch()    
    }

    async process(req, res, next){
        var id = req.params.id;
        var order = await Order.findOne({ _id: id});
        order = mongooseToOject(order);
        var orderSuccess = [];
        var sum = 0;
        for(const o of order.cart){
            var product = await Product.findOne({ _id: o.productId });
            product = mongooseToOject(product);
            if(product.sale == 0){
                sum += product.cost*o.count;
            }else{
                sum += (product.cost-product.cost*product.sale/100) * o.count;
            }
            orderSuccess.push({
                name: product.name,
                count: o.count,
                sale: product.sale,
                cost: product.cost,
                afterSale: (product.cost-product.cost*product.sale/100) * o.count,
            })
        }
        res.render('order/detail',{
            orderSuccess,
            sum,
            id: order._id
        });
    }

    async view(req, res, next){
        var id = req.params.id;
        var order = await Order.findOne({ _id: id});
        order = mongooseToOject(order);
        var orderSuccess = [];
        var sum = 0;
        for(const o of order.cart){
            var product = await Product.findOne({ _id: o.productId });
            product = mongooseToOject(product);
            if(product.sale == 0){
                sum += product.cost*o.count;
            }else{
                var x = (product.cost-product.cost*product.sale/100) * o.count;
                sum += x;
            }
            orderSuccess.push({
                name: product.name,
                count: o.count,
                sale: product.sale,
                cost: product.cost,
                afterSale: (product.cost-product.cost*product.sale/100) * o.count,
            })
        }
        res.render('order/view',{
            orderSuccess,
            sum
        });
    }

    async done(req, res, next){
        var id = req.params.id;
        if(id.match(/^[0-9a-fA-F]{24}$/)){
            await Order.updateOne({ _id: id}, { process: true });
        }
        var order = await Order.findOne({ _id: id });
        if(order){
            order = mongooseToOject(order);
        }
        var bill = {
            orderId: id,
            customerId: order.idCustomer,
            staffId: req.signedCookies.userId
        };
        bill = await new Bill(bill);
        bill.save(res.redirect('/admin/stored/orders'));
    }

}
module.exports = new OrderController();