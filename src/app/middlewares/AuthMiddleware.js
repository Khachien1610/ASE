const Account = require('../models/Account');
const Staff = require('../models/Staff');
const Customer = require('../models/Customer');

const { mongooseToOject } = require('../../ulti/mongoose');

class AuthMiddleware{

    async auth(req, res, next){
        // Không tồn tại userId
        if(!req.signedCookies.userId){
            res.redirect('/login');
            return;
        }

        // Không có tài khoản trong DB
        var account = await Account.findOne({ _id: req.signedCookies.userId })
            .then(account => account);
        if(!account){
            res.redirect('/login');
            return;
        }

        // Có tài khoản
        account = mongooseToOject(account);
        res.locals.username = account.username;
        res.locals.roleUser = account.role;

        // Set admin nếu là admin
        if(account.role == 'admin'){
            res.locals.admin = 'admin' ;
        }
        next();
    }

    async authL(req, res, next){
        // Không tồn tại userId
        if(!req.signedCookies.userId){
            next();
            return;
        }

        // Không có tài khoản trong DB
        var id = req.signedCookies.userId;
        if(id.match(/^[0-9a-fA-F]{24}$/)){
            var account = await Account.findOne({ _id: id })
            .then(account => account);
        }
        if(!account){
            next();
            return;
        }
        
        // Có tài khoản
        account = mongooseToOject(account);
        res.locals.username = account.username;
        res.locals.roleUser = account.role;

        // Set admin nếu là admin
        if(account.role == 'admin'){
            res.locals.admin = 'admin';
        }else{
            res.locals.admin = '';
        }
        next();
    }
    
}

module.exports = new AuthMiddleware();