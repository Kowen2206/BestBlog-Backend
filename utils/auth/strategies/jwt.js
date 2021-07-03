const passport = require('passport');
const {Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('@hapi/boom');

const UsersService = require('../../../services/users');
const {config} = require('../../../config');

passport.use(new Strategy({
    secretOrKey: config.authJsonWebToken,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async function (tojkenPayLoad, cb) {
    
    const userService = new UsersService();
    
    try{
        const user = await userService.getUser({email: tojkenPayLoad.email});
        if(!user){
            return cb(boom.unauthorized("No user"), false);
        }

        delete user.password;

        cb(null, {...user, scopes: tojkenPayLoad.scopes});

    }catch(err){ 
        return cb(err);
    }
}
));