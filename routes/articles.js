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

require('../utils/auth/strategies/jwt')

function articlesApi(app) {
    const router = express.Router();
    app.use('/api/article', router);

    const articleServices = new ArticleServices();

    // passport.authenticate('jwt', {session: false}) , scopesValidationHandler(["read:articles"])
    router.get("/", async (req, res, next) => {
        const { tags } = req.query;
      
        try {
            const articles = await articleServices.getArticles({ tags });
            res.status(200).json({
                data: articles,
                message: 'articles listed'
            });
        } catch (err) {
            next(err);
        }
    });

    router.get("/:articleId", validationHandler({ articleId: articleIdSchema }, 'params'), async (req, res, next) => {
        const { articleId } = req.params;
        try {
            const article = await articleServices.getArticle({ articleId });
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
            })
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
