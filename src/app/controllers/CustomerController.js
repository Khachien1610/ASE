const Customer = require('../models/Customer');
const Order = require('../models/Order');

const { mongooseToOject, multipleMongooseToObject } = require('../../ulti/mongoose');


class CustomerController{

    // [GET] /customers/:id/edit
    edit(req, res, next){
        Customer.findOne({ _id: req.params.id })
            .then((customer)=> {
                res.render('customers/edit',{
                    customer: mongooseToOject(customer)
                });
            })
    }

    // [PUT] /customers/:id
    async update(req, res, next){
        if(req.file){
            var file = req.file.path.split('\\').slice(3).join('\/');
            req.body.image = file;
        }
        Customer.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/admin/stored/customers'))
            .catch();
    }

    // [GET] /customers/orders
    async order(req, res, next){
        var order = await Order.find({});
        order = multipleMongooseToObject(order);
        for(var i = 0; i < order.length; i++){
            order[i].createdAt = order[i].createdAt.toLocaleString('en-GB', { hour12: false });
            order[i].updatedAt = order[i].updatedAt.toLocaleString('en-GB', { hour12: false });
        }
        res.render('customers/order', {
            order
        });
    }
}
module.exports = new CustomerController();