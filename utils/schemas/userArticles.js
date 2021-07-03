const joi = require('joi');

const {articleIdSchema} = require("./articles");

const {userIdSchema} = require("./users");

const userArticleIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const createArticleUserSchema = {
    articleIdSchema,
    userIdSchema
}

const deleteArticleSchema ={
    id: userArticleIdSchema.required()
}

module.exports = {
    userArticleIdSchema,
    createArticleUserSchema,
    deleteArticleSchema
}