const Staff = require('../models/Staff');
const Customer = require('../models/Customer');

const { mongooseToOject } = require('../../ulti/mongoose');

class AccountMiddleware{

    async image(req,res,next){
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

}

module.exports = new AccountMiddleware();