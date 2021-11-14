const express = require("express");
const passport = require("passport");
const ArticleServices = require("../services/articles");
const scopesValidationHandler = require("../utils/middlewares/scopesValidationHandler");
const validationHandler = require("../utils/middlewares/validationHandler");

const {
    articleIdSchema,
    createArticleSchema,
    updateArticleSchema,
    deleteArticleSchema,
} = require("../utils/schemas/articles");

require('../utils/auth/strategies/jwt');

function articlesApi(app) {
    const router = express.Router();
    app.use('/api/article', router);

    const articleServices = new ArticleServices();

    //Existen 3 casos de uso para get articles:
    // 1- Get All conseguir todos los articulos publicos, 
    //y si se manda un userId, también los privados que coincidan con el userId
    //2-Get one consigue un articulo si este es publico, o si este coincide con el userId enviado, si es que se envia un userId.
    //3-Get con tags, filtra el articulo con tags

    // passport.authenticate('jwt', {session: false}) , scopesValidationHandler(["read:articles"])
    router.get("/", async (req, res, next) => {
        const { tags, UserId } = req.body;
        try {
            const articles = await articleServices.getArticles({ tags, UserId });
            res.status(200).json({
                data: articles,
                message: 'articles listed'
            });
        } catch (err) {
            next(err);
        }
    });

    router.get("/user", async (req, res, next) => {
        const { tags, UserId } = req.body;
      
        try {
            const articles = await articleServices.getArticles({ tags, UserId });
            res.status(200).json({
                data: articles,
                message: 'articles listed'
            });
        } catch (err) {
            next(err);
        }
    });

    router.get("/getOne", async (req, res, next) => {
        const { ArticleId, UserId } = req.body;
        console.log('req.body');
        console.log(req.body);
        try {
            const article = await articleServices.getArticle({ ArticleId, UserId });
            res.status(200).json({
                data: article,
                message: 'article listed'
            });
        } catch (err) {
            next(err);
        }
    });

    router.post("/", validationHandler(createArticleSchema), async (req, res, next) => {

        const { body: article } = req;

        try {
            const articleId = await articleServices.createArticle({ article });
            res.status(200).json({
                data: articleId,
                message: 'article created'
            });
        } catch (err) {
            next(err);
        }
    });

    router.put("/:articleId", validationHandler({ articleId: articleIdSchema }, 'params'), validationHandler(updateArticleSchema), async (req, res, next) => {
        const { body: article } = req;
        const { articleId } = req.params;
        try {
            await articleServices.Updatearticle({ articleId, article });
            res.status(200).json({
                data: articleId,
                message: "Article upadated"
            });
        } catch (err) {
            next(err);
        }
    });

    router.delete("/:id", validationHandler(deleteArticleSchema, "params"), async (req, res, next) => {
        const articleId = req.params.id;
        try {
            const deletedUserArticleId = await articleServices.deleteArticle({ articleId });
            res.status(200).json({
                data: deletedUserArticleId,
                message: 'user article deleted'
            });
        } catch (err) {
            next(err);
        }
    });

}

module.exports = articlesApi;
