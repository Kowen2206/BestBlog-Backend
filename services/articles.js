const MongoLib = require('../lib/mongo.js');

class ArticlesService {

   constructor() {

      this.collection = 'articles';
      this.mongoDB = new MongoLib();

   }


   async getArticles({ tags }) {
      const query = tags && {UserId: tags};
      const articles = await this.mongoDB.getAll(this.collection, query);
      return articles || [];
   }

   async getArticle({ articleId }) {
      const article = await this.mongoDB.get(this.collection, articleId);
      return article || [];
   }

   async createArticle({ article }) {
      const createArticleId = await this.mongoDB.create(this.collection, article);
      return createArticleId || [];
   }

   async Updatearticle({ articleId, article }) {
      const updateArticleId = await this.mongoDB.update(this.collection, articleId, article);
      return updateArticleId || [];
   }

   async deleteArticle({articleId}) {
      const deleteUserArticleId = await this.mongoDB.delete(this.collection, articleId);
         return deleteUserArticleId || [];
   }
}

module.exports = ArticlesService;