const MongoLib = require('../lib/mongo.js');

class ArticlesService {

   constructor() {
      this.collection = 'articles';
      this.mongoDB = new MongoLib();
   }

   async getArticles({ tags, UserId = false }) {
      console.log(UserId);
      const query = tags? 
      {tags, $or: [{Status: 'private', UserId}, {Status: 'public'}]}
      : 
      {$or: [{Status: 'private', UserId}, {Status: 'public'}]}
      const articles = await this.mongoDB.getAll(this.collection, query);
      return articles || [];
   }

   //Añadir logica de consulta para trae un articulo mediante un query mas complejo
   async getArticle({ ArticleId, UserId }) {
      const query = {_id: ArticleId, $or :[{ Status: 'private', UserId }, {Status: 'public'}]};
      const publicArticle = await this.mongoDB.getWithQuey(this.collection, query);
      return publicArticle || [];
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