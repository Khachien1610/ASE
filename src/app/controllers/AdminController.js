const passwordValidator = require('password-validator');

const Product = require('../models/Product');
const Account = require('../models/Account');
const Staff = require('../models/Staff');
const Customer = require('../models/Customer');
const Provider = require('../models/Provider');
const { multipleMongooseToObject, mongooseToOject } = require('../../ulti/mongoose');

var schema = new passwordValidator();
schema 
.is().min(6)                                   
.is().max(100)                                  
.has().digits(1)                                
.has().letters()
.has().not().spaces()  

class AdminController{
    // [GET] /admin
    home(req, res, next){
        res.render('admin/home');
    }

    // [GET] /admin/stored/products
    storedProducts(req, res, next){
        Promise.all([Product.find(), Product.countDocumentsDeleted()])
            .then( ([products, deletedCount])  => {
                    products = multipleMongooseToObject(products);
                    for(var i = 0; i < products.length; i++){
                        products[i].createdAt = products[i].createdAt.toLocaleString('en-GB', { hour12: false });
                        products[i].updatedAt = products[i].updatedAt.toLocaleString('en-GB', { hour12: false });
                    }
                    res.render('admin/stored-products', {
                        products,
                        deletedCount,   
                    })
                })
            .catch()
    }
    
    // [GET] /admin/trash/products
    trashProducts(req, res, next){
        Product.findDeleted({})
            .then(products => {
                products = multipleMongooseToObject(products);
                for(var i = 0; i < products.length; i++){
                    products[i].deletedAt = products[i].deletedAt.toLocaleString('en-GB', { hour12: false});
                }
                res.render('admin/trash-products',{ 
                    products
                 });
            })
            .catch()
    }

    // [GET] /admin/stored/accounts
    storedAccounts(req, res, next){
        Promise.all([Account.find(), Account.countDocumentsDeleted()])
            .then( ([accounts, deletedCount])  => {
                    accounts = multipleMongooseToObject(accounts);
                    for(const account of accounts){
                        if(account.role != 'admin'){
                            account.role = '';
                        }
                    }
                    for(var i = 0; i < accounts.length; i++){
                        accounts[i].createdAt = accounts[i].createdAt.toLocaleString('en-GB', { hour12: false });
                        accounts[i].updatedAt = accounts[i].updatedAt.toLocaleString('en-GB', { hour12: false });
                    }
                    res.render('admin/stored-accounts', {
                        accounts,
                        deletedCount,   
                    })
                })
            .catch()
    }

    // [GET] /admin/trash/accounts
    trashAccounts(req, res, next){
        Account.findDeleted({})
            .then(accounts => {
                accounts = multipleMongooseToObject(accounts);
                for(var i = 0; i < accounts.length; i++){
                    accounts[i].deletedAt = accounts[i].deletedAt.toLocaleString('en-GB', { hour12: false});
                }
                res.render('admin/trash-accounts',{ 
                    accounts
                });
            })
            .catch()
    }

    // [GET] /admin/stored/staffs
    storedStaffs(req, res, next) {
        Staff.find({ delete: false})
            .then( (staffs) => {
                res.render('admin/stored-staffs', {
                    staffs: multipleMongooseToObject(staffs)
                });
            })
    }

    // [GET] /admin/stored/customers
    storedCustomers(req, res, next){
        // Customer.find({ delete: false})
        Customer.find({ delete: false})
            .then( (customers) => {
                res.render('admin/stored-customers', {
                    customers: multipleMongooseToObject(customers)
                });
            })
    }

    // [GET] /admin/stored/providers
    storedProviders(req, res, next){
        Promise.all([Provider.find(), Provider.countDocumentsDeleted()])
            .then( ([providers, deletedCount])  => {
                    providers = multipleMongooseToObject(providers);
                    for(var i = 0; i < providers.length; i++){
                        providers[i].createdAt = providers[i].createdAt.toLocaleString('en-GB', { hour12: false });
                        providers[i].updatedAt = providers[i].updatedAt.toLocaleString('en-GB', { hour12: false });
                    }
                    res.render('admin/stored-providers', {
                        providers,
                        deletedCount,   
                    })
                })
            .catch()
    }

    // [GET] /admin/trash/providers
    trashProviders(req, res, next){
        Provider.findDeleted({})
            .then(providers => {
                providers = multipleMongooseToObject(providers);
                for(var i = 0; i < providers.length; i++){
                    providers[i].deletedAt = providers[i].deletedAt.toLocaleString('en-GB', { hour12: false});
                }
                res.render('admin/trash-providers',{ 
                    providers
                });
            })
            .catch()
    }

}
module.exports = new AdminController();