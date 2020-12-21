
class RoleMiddleware{
    role(req, res, next){
        if(res.locals.roleUser == 'admin'){
            res.redirect('/admin');
            return;
        }
        if(res.locals.admin == ''){
            res.redirect('/');
            return;
        }
        next();
        return;
    }

    roleL(req, res, next){
        if(res.locals.roleUser == 'admin'){
            res.redirect('/admin');
            return;
        }
        next();
        return;
    }

    admin(req, res, next){
        if(res.locals.roleUser == 'admin'){
            next();
            return;
        }
        res.redirect('/');
        return;
    }
}

module.exports = new RoleMiddleware();