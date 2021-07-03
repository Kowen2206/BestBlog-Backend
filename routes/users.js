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

function users(app) {
    const userService = new UserService();
    const router = express.Router();
    app.use('/api/user', router);
    const apiKeysService = new ApiKeysService();

    router.put('/:id', async (req, res, next)=>{
        const {data} = req.body;
        const userId = req.params;
        try {
            console.log(data)
            console.log(userId)
            //await UserService.UpdateUserData({ userId, data }) 

        } catch (err) {
            next(err)
        }
    });

    router.put('/UserPhoto/:id', async (req, res, next)=>{
        const {data} = body;
        try {

        } catch (err) {
            next(err)
        }
    });

    router.get('/:id', async(req, res, next) =>{
        const {id} = req.params;
        console.log("id")
        console.log(req.params)
        const userData = await userService.getUserById(id)
        console.log("User-Data");
        console.log(userData);
        res.status(200).json({
            data: userData,
            message: 'user listed'
        });
    });
}

module.exports = users;