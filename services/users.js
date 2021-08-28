const MongoLib = require('../lib/mongo.js');
const bcryp = require('bcryptjs');
const { query } = require('express');
const { use } = require('passport');

class UsersService {

   constructor() {

      this.collection = 'users';
      this.mongoDB = new MongoLib();

   }

   async getUser({ email }) {
      const [user] = await this.mongoDB.getAll(this.collection, { email });
      return user || [];
   }

   async getUserById(id) {
      const user = await this.mongoDB.get(this.collection, id);
      return user || [];
   }

   async verifyUser({ name, email }) {
      const [user] = await this.mongoDB.getAll(this.collection, { name });
      const [emailUser] = await this.mongoDB.getAll(this.collection, { email });
      if (user || emailUser) {
         return true;
      } else {
         return false
      }
   }

   async createUser({ user }) {

      const nameExist = await this.verifyUser({ name: user.name, email: user.email })
      if (!nameExist) {
         const { name, email, password, isAdmin, photo } = user;
         const hashedPassword = await bcryp.hash(password, 10);

         const createUserId = await this.mongoDB.create(this.collection, { photo, name, email, password: hashedPassword, isAdmin: isAdmin });
         return createUserId;
      } else {
         return null;
      }

   }

   async getOrCreateUser({ user }) {
      const queryUser = await this.getUser({
         email: user.email
      });

      if (queryUser) {
         return queryUser;
      }

      await this.createUser({ user });
      return await this.getUser({ email: user.email });
   }

   async updateUser({ id, data }) {
      const updateUserId = await this.mongoDB.update(this.collection, id, data);
      return updateUserId || [];
   }

   async deleteArticle() {
      const deleteArticleId = await this.mongoDB.delete(this.collection, id);
      return deleteArticleId || [];
   }
}

module.exports = UsersService;