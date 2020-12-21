const Customer = require('../models/Customer');
const { mongooseToOject } = require('../../ulti/mongoose');


class CustomerController{

    // [GET] /staffs/:id/edit
    edit(req, res, next){
        Customer.findOne({ _id: req.params.id })
            .then((customer)=> {
                res.render('customers/edit',{
                    customer: mongooseToOject(customer)
                });
            })
    }

    // [PUT] /staffs/:id
    async update(req, res, next){
        if(req.file){
            var file = req.file.path.split('\\').slice(3).join('\/');
            req.body.image = file;
        }
        Customer.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/admin/stored/customers'))
            .catch();
    }
}
module.exports = new CustomerController();