const MongoLib = require('../lib/mongo.js');

class UsersArticlesService{

    constructor(){
        this.collection = 'articles';
        this.mongoDB = new MongoLib();
     } 
    
     async getUserArticle ({userId}) {
        const  query = userId && {userId};
        const userArticles = await this.mongoDB.getAll(this.collection, {userId});
        return user || [];
     }
 
      async createUserArticle({ userArticle }) {
         const createUserArticleId = await this.mongoDB.create(this.collection, userArticle);
         return createUserArticleId;
      }

      async Updatearticle({ articleId, article }) {
         console.log(articleId + " " + article);
         const updateArticleId = await this.mongoDB.update(this.collection, articleId, article);
         return updateArticleId || [];
      }
 
      async deleteUserArticle ({articleId}) {
         const deleteUserArticleId = await this.mongoDB.delete(this.collection, articleId);
         return deleteUserArticleId || [];
      }
}

module.exports = UsersArticlesService;