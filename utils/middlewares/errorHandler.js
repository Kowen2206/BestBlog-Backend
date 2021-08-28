const boom = require('@hapi/boom');
//traemos el archivo de configuracion para saber si estamos en modo producción o desarrollo. Con esto decidimos si mostrar el stack o no.
//El stack contiene toda la informacion relacionada al error, es importante, en produccion, tener cuidado que datos de error le damos a los usuarios.
const { config } = require('../../config');


//determina si mostrar el stack o no.
function withErrorStack(error, stack){
    if(config.dev){
        return { ...error, stack}
    }
    return error;
}

//middleware encargado de mostrar el error en un console.log
function logErrors(err, req, res, next){
    console.log('error handler');
    console.log(err);
    next(err);
}

//Sí el error se trata de un error boom, devuelve un error con las características de un object boom, si no, ejecuta el middleware de error de express.
function wrapErrors(){
    if(!err.isBoom){
        next(boom.badImplementation(err));
    }
    next(err);
}

//middleware encargado de manejar el error
//Usa la sintaxis para manejar errores con expres err,req,res,next
function errorHandler(err, req, res, next){ 
    const{ output: {statusCode, payload}} = err;
    res.status(statusCode);
    //res.json se encarga de darnos la respuesta en formato json, ya que por defecto esta viene en html.
    //ejecuta el metodo withErrorStack el cual decide si se trata de un error boom.
    res.json(withErrorStack(payload, err.stack))
}

module.exports = {
    logErrors,
    wrapErrors,
    errorHandler
}

