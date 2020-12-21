const crypto = require('crypto');

const Account = require('../models/Account');

class SessionMiddleware{
    session(req, res, next){
        if(!req.signedCookies.sessionId){
            res.cookie('sessionId', crypto.randomBytes(16).toString('base64'), { signed: true });
        }
        next();
    }
}

module.exports = new SessionMiddleware();