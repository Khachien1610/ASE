const bcrypt = require('bcrypt');
const passwordValidator = require('password-validator');

const Account = require('../models/Account');
const Staff = require('../models/Staff');
const { mongooseToOject } = require('../../ulti/mongoose');

var schema = new passwordValidator();
schema 
.is().min(6)                                   
.is().max(100)                                  
.has().digits(1)                                
.has().letters()
.has().not().spaces()  

class StaffController{
    // [GET] /staffs/create
    create(req, res, next){
        res.render('staffs/create');
    }

    // [POST] /staffs/create
    store(req, res, next){
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
                    res.render('staffs/create',{
                        errors
                    }); 
                    return;
                }

                if(account){ // Check tài khoản trùng
                    res.render('staffs/create',{
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
                        res.render('staffs/create',{
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
                        res.render('staffs/create',{
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
                req.body.role = 'staff';
                
                var account = await new Account(req.body); // Tạo tài khoản
                account
                    .save()
                    .then()

                var staff = {
                    name: req.body.name,
                    phone: '',
                    email: req.body.email,
                    gender: req.body.gender,
                    address: '',
                    birthday: '',
                    idAccount: account._id,
                    delete: false,
                    image: ''
                }

                staff = new Staff(staff);
                staff
                    .save()
                    .then()
                    
                res.redirect('/admin/stored/accounts');
            })    
    }

    // [GET] /staffs/:id/edit
    edit(req, res, next){
        Staff.findOne({ _id: req.params.id })
            .then((staff)=> {
                res.render('staffs/edit',{
                    staff: mongooseToOject(staff)
                });
            })
            .catch()
    }

    // [PUT] /staffs/:id
    async update(req, res, next){
        if(req.file){
            var file = req.file.path.split('\\').slice(3).join('\/');
            req.body.image = file;
        }
        Staff.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/admin/stored/staffs'))
            .catch();
    }
}
module.exports = new StaffController();