const passwordValidator = require('password-validator');

const Product = require('../models/Product');
const Account = require('../models/Account');
const Staff = require('../models/Staff');
const Customer = require('../models/Customer');
const Provider = require('../models/Provider');
const Order = require('../models/Order');
const Bill = require('../models/Bill');
const Student = require('../models/Student');

const { multipleMongooseToObject, mongooseToOject } = require('../../ulti/mongoose');
const e = require('express');

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

    // [GET] /admin/stored/orders
    storedOrders(req, res, next){
        Order.find({ process: false})
            .then( orders => {
                orders = multipleMongooseToObject(orders);
                for(var i = 0; i < orders.length; i++){
                    orders[i].createdAt = orders[i].createdAt.toLocaleString('en-GB', { hour12: false });
                }
                res.render('admin/stored-orders',{
                    orders
                })
            })
    }

    // [GET] /admin/stored/orders
    async storedBills(req, res, next){
        await Bill.find({})
            .then( async (bills) => {
                bills = multipleMongooseToObject(bills);
                for(var i = 0; i < bills.length; i++){
                    bills[i].createdAt = bills[i].createdAt.toLocaleString('en-GB', { hour12: false });
                }
                var customers = [];
                var staffs = [];
                for(const bill of bills){
                    var id = bill.customerId;
                    if (id.match(/^[0-9a-fA-F]{24}$/)){
                        var customer = await Customer.findOne({ _id : id });
                        if(customer) customer = mongooseToOject(customer);
                        bill.customerName = customer.name;
                        bill.customerId = customer._id;
                    }
                }
                for(const bill of bills){
                    var id = bill.staffId;
                    if (id.match(/^[0-9a-fA-F]{24}$/)){
                        var staff = await Staff.findOne({ idAccount: id });
                        if(staff) {
                            staff = mongooseToOject(staff);
                            bill.staffName = staff.name;
                            bill.staffId = staff._id;
                        }
                    }
                }
                res.render('admin/stored-bills',{
                    bills,
                })
            })
    }

}
module.exports = new AdminController();