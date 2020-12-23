const bcrypt = require('bcrypt');
const passwordValidator = require('password-validator');

const Product = require('../models/Product');
const Account = require('../models/Account');
const Customer = require('../models/Customer');


const { multipleMongooseToObject, mongooseToOject } = require('../../ulti/mongoose');

var schema = new passwordValidator();
schema 
.is().min(6)                                   
.is().max(100)                                  
.has().digits(1)                                
.has().letters()
.has().not().spaces()                           

class SiteController{
    // [GET] 
    async index(req, res, next){
        Product.find({})
            .then(products => {
                res.render('home',{ 
                    products: multipleMongooseToObject(products),
                 });
            })
            .catch();
    }

    // [GET]
    register(req, res, next){
        res.render('account/register');
    }

    // [POST]
    async postRegister(req, res, next){
        Account.findOne({ username: req.body.username })
            .then(async (account)=>{
                var errors = [];
                if(req.body.name == ''){
                    errors.push('Bạn chưa nhập họ tên!');
                }
                if(req.body.email == ''){
                    errors.push('Bạn chưa nhập email!');
                }
                if(req.body.username == ''){
                    errors.push('Bạn chưa nhập tên tài khoản!');
                }
                if(req.body.password == ''){
                    errors.push('Bạn chưa nhập mật khẩu!');
                }
                if(req.body.gender == undefined){
                    errors.push('Bạn chưa chọn giới tính!');
                }
                if(errors.length !== 0){
                    res.render('account/register',{
                        errors
                    }); 
                    return;
                }

                if(account){ // Check tài khoản trùng
                    res.render('account/register',{
                        errors: ['Tài khoản đã tồn tại, mời bạn đăng ký lại với tài khoản khác!']
                    });
                    return;
                }
                // USERNAME VALIDATE
                if(schema.validate(req.body.username) === false){
                    var listError = schema.validate(req.body.username, { list: true });
                    var letterError = [];
                    for(var error of listError){
                        if(error == 'max'){
                            letterError.push('Tài khoản chỉ có tối đa 100 ký tự!');
                        }
                        if(error == 'letters'){
                            letterError.push('Tài khoản phải có chữ cái!');
                        }
                        if(error == 'spaces'){
                            letterError.push('Tài khoản không được chứa dấu cách!');
                        }
                    }
                    
                    if(letterError.length !== 0){
                        res.render('account/register',{
                            errors: letterError
                        }); 
                        return;
                    }
                }
                //PASSWORD VALIDATE
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
                        res.render('account/register',{
                            errors
                        });
                        return;
                    }
                }else{
                    req.body.password = await bcrypt.hash(req.body.password, 10) // Hash password sau khi validate
                        .then(function(hash) {
                            return hash;
                        });
                }
                req.body.role = 'customer';
                
                var account = await new Account(req.body); // Tạo tài khoản
                account
                    .save()
                    .then()

                var customer = {
                    name: req.body.name,
                    phone: '',
                    email: req.body.email,
                    gender: req.body.gender,
                    address: '',
                    birthday: '',
                    idAccount: account._id,
                    point: 0,
                    delete: false
                }
                customer = new Customer(customer);
                customer
                    .save()
                    .then()
                res.redirect('/login');
            })    
    }

    // [GET]
    login(req, res, next){
        res.render('account/login');
    }

    // [POST]
    postLogin(req, res, next){
        Account.findOne({ username: req.body.username })
            .then((account)=>{
                bcrypt.compare(req.body.password, account.password)
                    .then(function(result) {
                        if(result == false){
                            res.render('account/login',{
                                error: ['Mật khẩu không chính xác!']
                            });
                            return;
                        }   
                        res.cookie('userId', account._id, { signed: true });
                        res.redirect('/');
                    });
            })
            .catch((error)=>{
                res.render('account/login',{
                    error: ['Tài khoản không tồn tại!']
                })
            })
    }
    
    // [GET] /logout
    logout(req, res, next){
        res.clearCookie('userId');
        res.clearCookie('sessionId');
        res.redirect('/');
    }

    // [GET] /infoaccount
    infoAccount(req, res, next){
        Customer.findOne({ idAccount: req.signedCookies.userId})
            .then( customer => {
                res.render('customers/edit',{
                    customer: mongooseToOject(customer)
                })
            })
            .catch()
    }
    
}

module.exports = new SiteController();