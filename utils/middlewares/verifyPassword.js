const boom = require('@hapi/boom');
const bcrypt = require('bcryptjs');
const UserService = require("../../services/users");

function verifyPassword() {
    return async function (req, res, next){
        const { id } = req.params;
        const data = { ...req.body }
        const { password } = data;
        const userService = new UserService();
    
        try{
            const user = await userService.getUserById(id);
            if(!user){
                delete password;
                next(boom.badRequest());
                return null;
            }
    
            if(!(await bcrypt.compare(password, user.password))){
                delete password;
                next(boom.unauthorized("La contraseña es incorrecta"));
                return null;
            }else{
                delete user.password;
                delete password;
                delete data;
                next();
            }

        }catch(err){
            next(boom.badImplementation('Error interno'));
        }
    
    };
}

module.exports = verifyPassword;
