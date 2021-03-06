const {MongoClient, ObjectId} = require('mongodb');
const {config} = require('../config');
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;

MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${config.dbPort}/${config.dbName}?retryWrites=true&w=majority`;

class MongoLib{

    constructor(){
        this.client = new MongoClient(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
        this.dbName = DB_NAME;
    }

    connect(){
        if(!MongoLib.connection){
            MongoLib.connection = new Promise((resolve, reject) => {
                this.client.connect(err =>{
                    if(err){
                        reject(err + "ERROR MONGO");
                    }
                    resolve(this.client.db(this.dbName));
                })
            })
        }
        return MongoLib.connection;
    }

    getAll(collection, query){
        return this.connect().then(db =>{
            return db.collection(collection).find(query).toArray();
        });
    }

    get(collection, id){
        return this.connect().then(db =>{
            return db.collection(collection).findOne({ _id: ObjectId(id) })
        })
    }

    //Investigar como hacer query compuesto para traer documentos con campo status publico
    //y ademas campos con documento privado donde el id sea igual al userId
    getWithQuey(collection, query){
        console.log(query);
        if(query._id)  {
            console.log('query._id');
            console.log(query._id);
         } else {
            console.log('NO query._id');
        }
        return this.connect().then(db =>{
            return db.collection(collection).findOne( query._id ? { ...query, _id: ObjectId(query._id)} : query);
        })
    }

    create(collection, data){
        return this.connect().then(db =>{
            return db.collection(collection).insertOne(data);
        }).then(result => result.insertedId);
    }

    update(collection, id, data){
        return this.connect().then(db =>{
            return db.collection(collection).updateOne({_id: ObjectId(id)}, {$set:data}, {upsert: true})
        }).then(result => result.upsertedId || id);
    }

    delete(collection, id){
        return this.connect().then(db =>{
            return db.collection(collection).deleteOne({_id: ObjectId(id)});
        }).then(res=> {
            console.log(res);
            id
        });
    }

}

module.exports = MongoLib