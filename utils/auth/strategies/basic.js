const passport = require('passport');
const {BasicStrategy} = require('passport-http');
const boom = require('@hapi/boom');
const bcrypt = require('bcryptjs');

const UserService = require("../../../services/users");

passport.use(new BasicStrategy(async function(email, password, cb){
    console.log('itHasBeen Excecuted basic strategy');
    const userService = new UserService();

    try{
        const user = await userService.getUser({email});
        if(!user){
            return cb(boom.unauthorized("EL usuario no existe"), false);
        }

        if(!(await bcrypt.compare(password, user.password))){
            return cb(boom.unauthorized("La contraseña es incorrecta"), false);
        }

        delete user.password;

        return cb(null, user);

    }catch(err){
        return cb(err)
    }
}));