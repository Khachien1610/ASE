
const Order = require('../models/Order');
const Product = require('../models/Product');
const Bill = require('../models/Bill');

const { mongooseToOject } = require('../../ulti/mongoose');
const Customer = require('../models/Customer');
const Staff = require('../models/Staff');

class BillController{
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
        var ship = order.ship;
        var point = order.point;

        var customer = await Customer.findOne({ _id: order.idCustomer });
        if(customer){
            customer = mongooseToOject(customer);
        }

        var bill = await Bill.findOne({ orderId: order._id });
        if(bill){
            bill = mongooseToOject(bill);
        }
        var staff = await Staff.findOne({ idAccount: bill.staffId });
        if(staff){
            staff = mongooseToOject(staff);
        }

        res.render('bill/view',{
            orderSuccess,
            sum,
            point,
            ship,
            remainder: sum + ship - point*1000,
            customer,
            staff: staff.name
        });
    }

}
module.exports = new BillController();