const { mongooseToOject } = require('../../ulti/mongoose');
const Provider = require('../models/Provider');

class ProviderController{
    
    // [GET] /providers/create
    create(req, res, next ){
        res.render('providers/create');
    }

    // [POST] /providers/create
    store(req, res, next){
        const provider = new Provider(req.body);
        provider
            .save()
            .then(() => res.redirect('/admin/stored/providers'))
            .catch();
    }

    // [GET] /providers/:id/edit
    edit(req, res, next){
        Provider.findOne({ _id : req.params.id })
            .then( (provider)=>{
                res.render('providers/edit',{
                    provider: mongooseToOject(provider)
                })
            } )
    }

    // [PUT] /providers/:id
    update(req, res, next){
        Provider.updateOne({ _id : req.params.id }, req.body)
            .then( () => res.redirect('/admin/stored/providers'))
            .catch()
    }

    delete(req, res, next){
        Provider.delete({ _id: req.params.id }) // delele of mongoose-delete npm
            .then(() => res.redirect('back'))
            .catch();
    }

    restore(req, res, next){
        Provider.restore({ _id: req.params.id }) // restore of mongoose-delete npm
        .then(() => res.redirect('back'))
        .catch();
    }

    foreceDelete(req, res, next){
        Provider.deleteOne({ _id: req.params.id }) // delele of mongoose-delete npm
        .then(() => res.redirect('back'))
        .catch();
    }

}

module.exports = new ProviderController();