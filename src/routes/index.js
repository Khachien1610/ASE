const siteRouter = require('./site');
const adminRouter = require('./admin');
const productsRouter = require('./products');
const accountsRouter = require('./accounts');
const staffRouter = require('./staffs');
const customerRouter = require('./customer');
const providerRouter = require('./provider');

const AuthMiddleware = require('../app/middlewares/AuthMiddleware');
const RoleMiddleware = require('../app/middlewares/RoleMiddleware');
const AccountMiddleware = require('../app/middlewares/AccountMiddleware');


function route(app){

    app.use('/admin', AuthMiddleware.auth, RoleMiddleware.admin, AccountMiddleware.image, adminRouter);
    
    app.use('/products', AccountMiddleware.image, productsRouter);

    app.use('/accounts', AuthMiddleware.auth, AccountMiddleware.image, accountsRouter);

    app.use('/staffs', AuthMiddleware.auth, AccountMiddleware.image, staffRouter);

    app.use('/customers', AuthMiddleware.auth, AccountMiddleware.image, customerRouter);

    app.use('/providers', AuthMiddleware.auth, AccountMiddleware.image, providerRouter);

    app.use('/', AccountMiddleware.image, siteRouter);
    
}

module.exports = route;