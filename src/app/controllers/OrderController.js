
const Order = require('../models/Order');
const Product = require('../models/Product');
const Bill = require('../models/Bill');
const Customer = require('../models/Customer');


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
        var ship;
        if(sum < 1000000){
            ship = 50000;
        }else{
            ship = 0;
        }
        var customer = await Customer.findOne({ _id: order.idCustomer });
        if(customer){
            customer = mongooseToOject(customer);
        }
        var remainder = sum - order.point*1000 + ship;
        res.render('order/detail',{
            orderSuccess,
            sum,
            id: order._id,
            remainder,
            ship,
            point: order.point,
            customer
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
        var point = order.point;
        var ship = order.ship;
        var customer = await Customer.findOne({ _id: order.idCustomer });
        if(customer){
            customer = mongooseToOject(customer);
        }
        res.render('order/view',{
            orderSuccess,
            sum,
            point,
            ship,
            remainder: sum + ship - point*1000,
            customer
        });
    }

    async done(req, res, next){
        var id = req.params.id;
        if(id.match(/^[0-9a-fA-F]{24}$/)){
            await Order.updateOne({ _id: id }, { process: true });
        }
        var order = await Order.findOne({ _id: id });
        if(order){
            order = mongooseToOject(order);
        }
        var customer = await Customer.findOne({ _id: order.idCustomer });
        if(customer){
            customer = mongooseToOject(customer);
        }

        var pointReturn = order.total*0.01/1000;
        pointReturn = Math.floor(pointReturn);
        customer.point += pointReturn;
        customer.point = parseInt(customer.point);
        await Customer.updateOne({  _id: order.idCustomer}, customer);

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