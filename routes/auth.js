
//Este archivo se encarga de las rutas sign-in y sign-up, para entender como funciona este codigo es aconsejable leer la documentación donde se explica, como y 
//porque usar un custom callback.

//Veo que muchos tienen problemas para entender el codigo, así que tratare de explicarlo, pero les sugiero a quienes no entienden el codgio, lean la 
//documentación y aunque no lo entiendan a la primera hagan un esfuerzo por entenderlo, ya que en un trabajo como desarrollador este será el pan de cada día 
//y en muchas ocasiones solo puedes depender de la documentación.

//Antes de continuar quiero aclarar que passport cuenta con más de 500 estrategias, cada estrategia esta documentada en la pagina de passport
//y es ahí, en la documentación, donde se explica como implementar una u otra estrategia, como desarrollador tu debes investigar que estrategia es la mas optima 
//para tu proyecto e implementarla siguiendo la documentación.

//Lo primero es entender que passport se ejecuta como un middleware mediante express,esto significa que al definir una ruta nostros podemos pasar como parametro la 
//estrategia de passport que deseamos utilizar, así como hicimos con el validationHandler, quedando algo así:

// router.post('/ruta/ejemplo', passport.authenticate('basic', function(req, res){ res.redirect('/users/' + req.user.username);}));

//La sintaxis anterior es la sintaxis que comunmente se usa para implementar una estrategia de passport, passport.authenticate es un método que solo
//recive 2 parametros, la estrategia que queremos utilizar y  una funcion que generalmente se encarga de enviar una respuesta al cliente.


//Si bien la sintaxis es algo diferente a la usada en la clase, entender esto es lo primero para entender passport, ya que la sintaxis usada en clase es solo
//una manera distinta de hacer lo mismo. 

//Lo que usamos en clase, como guillermo dijo, es usar un custom callback, (recordemos que un callback es un funcion que
//se ejecuta dentro de otra función), lo que esto quiere decir en passport es que, en lugar de ejecutar el metodo authenticate justo al ingresar a la ruta, primero
//ejecutaremos una funcion anonima creada por nosotros que posteriormente ejecutara el methodo autenticate.

//Esto lo hacemos porque en ocasiones querremos acceder a alguna propiedad del req antes de ejecutar el methodo authenticate, en el caso de la clase, es importante
//ya que primero verificamos que el req tenga un apiKeyToken y luego, si el req tiene el apiKeyToken ejecutamos el método authenticate, si no devolvemos un error.

//El api key es una llave que definimos en el servidor para abrir el acceso a nuestro servicio, así, si algún servicio en internet no tiene la llave que estás
// definiendo, no podrá acceder a tu servicio

//debajo he dejado el codigo de la clase con comentarios.
const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const {config} = require('../config');
const ApiKeysService = require('../services/apiKeys');

const UserService = require('../services/users');
const validationHandler = require('../utils/middlewares/validationHandler');
const {createUserSchema, createProviderSchema } = require('../utils/schemas/users');
const { query } = require('express');
 
//Ejecuta la estrategia basic mediante el metodo passport.use
require('../utils/auth/strategies/basic');

function authApi(app){

    const userService = new UserService();
    const router = express.Router();
    app.use('/api/auth', router);
    const apiKeysService = new ApiKeysService();

    //esta ruta valida que el body del request contenga un api-key valido, un usuario y contraseña.
    //Usa un custom callback para antes de ejecutar la estrategia basic poder acceder al req.body y validar que contenga un apiKeyToken
    router.post('/sign-in', async function (req, res, next) {
        const { apiKeyToken} = req.body;
        console.log('--------------------------------------------BODY-----------------------------------------------');
        console.log(req.body);
        if(!apiKeyToken){
            next(boom.unauthorized('ApiKeyToken is requerid'));
        }

        passport.authenticate('basic', function (err, user) {
            try{

                if(err || !user){
                    next(boom.unauthorized());
                } 

                req.logIn(user, {session: false}, async function (err){
                    if(err){
                        next(err);
                    }

                    const apiKey = await apiKeysService.getApiKey({token: apiKeyToken});
                    if(!apiKey){
                        next(boom.unauthorized());
                    }

                    console.log('---------------------user-----------------');
                    console.log(user);

                    const {_id: id, name, email, photo} = user;
                    const payload = {
                        sub: id, 
                        name,
                        email,
                        photo,
                        scopes: apiKey.scopes
                    }

                    const token = jwt.sign(payload, config.authJsonWebToken, {
                        expiresIn: '15h'
                    });
                    
                   return res.status(200).json({token, user: {id, name, email, photo}})

                });
            }catch(err){
                next(err);
            }
        })(req, res, next);
    });
    
    router.post('/sign-up', validationHandler(createUserSchema), async function(req, res, next){
        const {body: user} = req;
        console.log(user);
        try{
            const createdUserId = await userService.createUser({user});
            console.log(createdUserId);
            if(createdUserId !== null){
                res.status(200).json({
                    data: createdUserId,
                    message: 'User created'
                });
            }else{
                next(boom.badRequest("El nombre de usuario o correo ya ha sido registrado"));
            }
            

        }catch(err){
            next(err);
        }
    });


    router.post('/sign-provider', validationHandler(createProviderSchema), 
    async function (req, res, next){
        const {body} = req;

        const {apiKeyToken, ...user} = body;

        if(!apiKeyToken){
            next(boom.unauthorized("APIKeyToken is required"));
        }

        try {

            const queryUser = await userService.getOrCreateUser({user});
            const apiKey = await apiKeysService.getApiKey({token: apiKeyToken});

            if(!apiKey){
                next(boom.unauthorized());
            }

            const {id: id, name, email} = queryUser;
            const payload = {
                sub: id, 
                name, 
                email, 
                scopes: apiKey.scopes
            }

            const token = jwt.sign(payload, config.authJsonWebToken, {expiresIn: '15h'});

            return res.status(200).json({token, user:{id, name, email}})
            
        } catch (error) {
            next(err);
        }
    })
    
}

module.exports =  authApi;