const MongoLib = require('../lib/mongo.js');
const bcryp = require('bcryptjs');
const { query } = require('express');
const { use } = require('passport');

class UsersService{

    constructor(){

        this.collection = 'users';
        this.mongoDB = new MongoLib();
  
     }
   
    
     async getUser ({email}) {
        const [user] = await this.mongoDB.getAll(this.collection, {email});
        console.log("getUser")
        console.log(user)
        return user || [];
     }

     async getUserById (id) {
      console.log("getUser")
      console.log(id)
      const user = await this.mongoDB.get(this.collection, id);
      console.log("getUser")
      console.log(user)
      return user || [];
   }
 
     async verifyName ({name}){
      const [user] = await this.mongoDB.getAll(this.collection, {name});
      if(user){
         console.log("El usuario ya existe");
         console.log(user);
         return true;
      }else{
         return false
      }
     }

      async createUser({ user }) {

        const nameExist = await this.verifyName({name: user.name})
         if(!nameExist){
            const {name, email, password, isAdmin, photo} = user;
            const hashedPassword = await bcryp.hash(password, 10);

            const createUserId = await this.mongoDB.create(this.collection, {photo, name, email, password: hashedPassword, isAdmin: isAdmin});
            return createUserId;
         }else{
            return {error: "UserNameAlreadyExist"}
         }
         
      }

      async getOrCreateUser({user}){
         const queryUser = await this.getUser({
            email: user.email
         });

         if(queryUser){
            return queryUser;
         }

         await this.createUser({user});
         return await this.getUser({email: user.email});
      }

      async UpdateUserData({ userId, data }) {
         console.log("update user data");
         console.log(userId + " " + data);
         const updateUserId = await this.mongoDB.update(this.collection, userId, article);
         return updateUserId || [];
      }

      async deleteArticle () {
         const deleteArticleId = await this.mongoDB.delete(this.collection, id);
         return deleteArticleId || [];
      }
}

module.exports = UsersService;