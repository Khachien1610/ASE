const bcrypt = require('bcrypt');
const passwordValidator = require('password-validator');

const Account = require('../models/Account');
const Staff = require('../models/Staff');
const Customer = require('../models/Customer');
const { mongooseToOject } = require('../../ulti/mongoose');

var schema = new passwordValidator();
schema 
.is().min(6)                                   
.is().max(100)                                  
.has().digits(1)                                
.has().letters()
.has().not().spaces()  

class AccountController{
    
    // [GET] /accounts/:id
    show(req, res, next){
        Account.findOne({ _id: req.params.id })
            .then( account =>{
                res.render('account/show', {
                    account: mongooseToOject(account),
                })
            })
            .catch()
    }

    // [GET] /accounts/:id/password/edit
    edit(req, res, next){
        Account.findOne({ _id: req.params.id })
            .then( account =>{
                res.render('account/edit', {
                    account: mongooseToOject(account),
                })
            })
            .catch()
    }

    // [POST] /accounts/:id/password/edit
    update(req, res, next){
        Account.findOne({ _id: req.params.id})
            .then(async account =>{
                account = mongooseToOject(account);
                await bcrypt.compare(req.body.passwordOld, account.password)
                    .then(async function(result) {
                        if(req.body.password == '' && req.body.passwordOld == ''){
                            res.render('account/edit',{
                                errors: ['Bạn chưa nhập gì, hãy nhập mật khẩu cũ và mới!'],
                                account
                            });
                            return;
                        }
                        if(req.body.passwordOld == ''){
                            res.render('account/edit',{
                                errors: ['Mời bạn nhập mật khẩu cũ!'],
                                account
                            });
                            return;
                        }
                        if(req.body.password == ''){
                            res.render('account/edit',{
                                errors: ['Mời bạn nhập mật khẩu mới!'],
                                account
                            });
                            return;
                        }
                        if(result == false){
                            res.render('account/edit',{
                                errors: ['Mật khẩu cũ không chính xác!'],
                                account
                            });
                        }else{
                            if(schema.validate(req.body.password) === false){ // Validate password
                                var listError = schema.validate(req.body.password, { list: true });
                                var errors = listError.map(function(error){
                                    var x = [];
                                    if(error == 'min'){
                                        x.push('Mật khẩu phải có ít nhất 6 ký tự!');
                                    }
                                    if(error == 'max'){
                                        x.push('Mật khẩu chỉ có tối đa 100 ký tự!');
                                    }
                                    if(error == 'letters'){
                                        x.push('Mật khẩu phải có chữ cái!');
                                    }
                                    if(error == 'digits'){
                                        x.push('Mật khẩu phải có chữ số!');
                                    }
                                    if(error == 'spaces'){
                                        x.push('Mật khẩu không được chứa dấu cách!');
                                    }
                                        return x;
                                    })
                                if(errors){
                                    res.render('account/edit',{
                                        errors,
                                        account
                                    });
                                    return;
                                }
                            }else{
                                req.body.password = await bcrypt.hash(req.body.password, 10) // Hash password sau khi validate
                                    .then(function(hash) {
                                    return hash;
                                });
                                Account.updateOne({ _id: req.params.id }, req.body)
                                    .then(() => res.redirect('/admin/stored/accounts'))
                                    .catch();
                            }
                        }   
                    }); 
            })
            .catch()
    }

    // [DELETE] /accounts/:id   
    accountsDelete(req, res, next){
        Account.delete({ _id: req.params.id }) // delele of mongoose-delete npm
            .then( async () =>{
                res.redirect('back');
                await Promise.all([ Staff.findOne({ idAccount: req.params.id }), Customer.findOne({ idAccount: req.params.id })] )
                .then( ([staff, customer])  => {
                    if(staff){
                        staff.delete = true;
                        staff
                            .save()
                    }
                    if(customer){
                        customer.delete = true;
                        customer
                            .save()
                    }
                })
                .catch()
            })
            .catch();
    }

    // [PATCH] /accounts/:id/restore
    accountsRestore(req, res, next){
        Account.restore({ _id: req.params.id }) // restore of mongoose-delete npm
            .then( async () => {
                res.redirect('back');
                await Promise.all([ Staff.findOne({ idAccount: req.params.id }), Customer.findOne({ idAccount: req.params.id })] )
                    .then( ([staff, customer])  => {
                        if(staff){
                            staff.delete = false;
                            staff
                                .save()
                        }
                        if(customer){
                            customer.delete = false;
                            customer
                                .save()
                        }
                    })
                    .catch()
            })
            .catch();
    }

    // [DELETE] /accounts/:id/force
    accountsForeceDelete(req, res, next){
        Account.deleteOne({ _id: req.params.id }) // delele of mongoose-delete npm
            .then( async () => {
                res.redirect('back');
                await Promise.all([ Staff.deleteOne({ idAccount: req.params.id }) , Customer.deleteOne({ idAccount: req.params.id })])
                    .then()
                    .catch()
            })
            .catch();
    }   

}

module.exports = new AccountController();