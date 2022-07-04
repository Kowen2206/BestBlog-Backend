const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const {config} = require('../config');
const ApiKeysService = require('../services/apiKeys');
const bcryp = require('bcryptjs');

const UserService = require('../services/users');
const {createUserSchema, createProviderSchema } = require('../utils/schemas/users');
const { query } = require('express');
const verifyPassword = require('../utils/middlewares/verifyPassword');
 
//Ejecuta la estrategia basic mediante el metodo passport.use
require('../utils/auth/strategies/basic');

function users(app) {
    const userService = new UserService();
    const router = express.Router();
    app.use('/api/user', router);
    const apiKeysService = new ApiKeysService();

    router.put('/:id', verifyPassword(),async (req, res, next)=>{
        const data = req.body;
        const newPassword  = data.newPassword;
        //console.log(data);
        const {id} = req.params;
        newPassword? data.password =  await bcryp.hash(newPassword, 10) : null;
        delete newPassword;
        
        try {
            await userService.updateUser({ id: id, data }); 
            res.status(200).json({
                message: "User upadated"
            });

        } catch (err) {
            next(err)
        }
    });

    router.get('/:id', async(req, res, next) =>{
        const {id} = req.params;
        //console.log("id")
        //console.log(req.params)
        const userData = await userService.getUserById(id)
        //console.log("User-Data");
        //console.log("User-Datas");
        //console.log(userData);
        res.status(200).json({
            data: userData,
            message: 'user listed'
        });
    });
}

module.exports = users;