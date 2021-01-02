const Product = require('../models/Product');
const Provider = require('../models/Provider');

const { mongooseToOject, multipleMongooseToObject } = require('../../ulti/mongoose');

class ProductController{
    // [GET] /products/:slug
    show(req, res, next) {
        Product.findOne({ slug: req.params.slug })
            .then((product) =>
                res.render('products/show', {
                    product: mongooseToOject(product),
                    userId: req.signedCookies.userId
                }),
            )
            .catch();
    }

    // [GET] /products/create
    create(req, res, next) {
        // Hiển thị ra phần view của trang /products/create
        Provider.find({})
            .then( providers => {
                res.render('products/create',{
                    providers: multipleMongooseToObject(providers)
                });    
            })
    }

    // [POST] /products/store
    async store(req, res, next) {
        req.body.updatedUser = '';
        req.body.updatedReason = '';
        req.body.saleAt = '';
        req.body.saleUser = '';
        req.body.saleReason = '';
        if(req.body.cost == '' ) req.body.cost = 0;    
        req.body.sale = 0;

        if(req.files){
            var files = req.files;
            var fileDone = [];
            for(const file of files){
                fileDone.push(file.path.split('\\').slice(3).join('\/'));
            }
            req.body.images = fileDone;
        }
        const product = new Product(req.body);
        product
            .save()
            .then(() => res.redirect('/admin/stored/products'))
            .catch();
    }

    // [GET] /products/:id/edit
    edit(req, res, next){
        Product.findOne({ _id: req.params.id })
        .then( async (product) => {
            var providers = await Provider.find({ name: {$ne: product.provider}})
                .then( providers => providers)
            res.render('products/edit', {
                product: mongooseToOject(product),
                providers: multipleMongooseToObject(providers)
            });
        })
        .catch();
    }

    // [PUT] /products/:id
    async update(req, res, next){
        if(req.files.length !=0 ){
            var files = req.files;
            var fileDone = [];
            for(const file of files){
                fileDone.push(file.path.split('\\').slice(3).join('\/'));
            }
            req.body.images = fileDone;
        }

        var change, objChange;
        await Product.findOne({ _id: req.params.id})
            .then(  async (product) => {
                product = mongooseToOject(product);
                if(product.change){
                    change = product.change;
                }else{
                    change = [];
                }
                
                if(product.cost != req.body.cost || product.sale != req.body.sale ){
                    objChange = {
                        cost: parseInt(req.body.cost),
                        sale: parseInt(req.body.sale),
                    };
                    change.push(objChange);
                    req.body.change = change;
                }
            })
            .catch()
        Product.updateOne({ _id: req.params.id }, req.body)
            .then( () => res.redirect('/admin/stored/products') )
            .catch();
    }

    // [DELETE] /products/:id
    delete(req, res, next){ 
        Product.delete({ _id: req.params.id }) // delele of mongoose-delete npm
            .then(() => res.redirect('back'))
            .catch();
    }

    // [PATCH] /products/:id/restore
    restore(req, res, next){ 
        Product.restore({ _id: req.params.id }) // restore of mongoose-delete npm
            .then(() => res.redirect('back'))
            .catch();
    }

    // [DELETE] /products/:id/force
    forceDelete(req, res, next){ 
        Product.deleteOne({ _id: req.params.id }) // delele of mongoose-delete npm
            .then(() => res.redirect('back'))
            .catch();
    }
    
}

module.exports = new ProductController();
