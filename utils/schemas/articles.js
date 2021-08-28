const joi = require('joi');

const articleIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const articleTitleSchema = joi.string().max(80);
const articleDateSchema = joi.string().max(10)
const articleArticlePhotoSchema = joi.string().uri();
const articlePreviewSchema = joi.string().min(1).max(200);
const articleContentSchema = joi.string().min(170);
//const articleTagsSchema = joi.array().items(joi.string().max(50));
const articleTagsSchema = joi.string();
const articleUserNameAutorSchema = joi.string().max(30);
const articleUserPhotoAutorSchema = joi.string().uri();
const articleUserIdSchema = joi.string();


//const {articleIdSchema} = require("./articles");
const {userIdSchema} = require("./users");
const userArticleIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const createArticleSchema = {
    Title: articleTitleSchema.required(),
    ArticleContent: articleContentSchema.required(),
    Preview: articlePreviewSchema.required(),
    UserName: articleUserNameAutorSchema.required(),
    Date: articleDateSchema.required(),
    ArticlePhoto: articleArticlePhotoSchema,
    tags: articleTagsSchema,
    UserPhoto: articleUserPhotoAutorSchema,
    UserId: articleUserIdSchema
}

const updateArticleSchema = {
    Title: articleTitleSchema.required(),
    ArticleContent: articleContentSchema.required(),
    Preview: articlePreviewSchema.required(),
    UserName: articleUserNameAutorSchema.required(),
    Date: articleDateSchema.required(),
    ArticlePhoto: articleArticlePhotoSchema.required(),
    tags: articleTagsSchema,
    UserPhoto: articleUserPhotoAutorSchema
}

const deleteArticleSchema ={
    id: userArticleIdSchema.required()
}


module.exports = {
    userArticleIdSchema,
    deleteArticleSchema,
    articleIdSchema,
    createArticleSchema,
    updateArticleSchema
}
