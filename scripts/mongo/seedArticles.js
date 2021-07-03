// DEBUG=app:* node scripts/mongo/seedArtciles.js

const chalk = require("chalk");
const debug = require("debug")("app:script:articles");
const MongoLib = require("../../lib/mongo");
const {articlesMock} = require("../../utils/mocks/articles");

async function seedArticles(){
    try{
        const mongoDB = new MongoLib();
        const promises = articlesMock.map(async article=>{
            await mongoDB.create("articles", article);
        });

        await Promise.all(promises);
        debug(chalk.blue(`${promises.length} artciles have been created succesfully`));
        return process.exit(0);
    }catch(err){
        debug(chalk.red(err));
        process.exit(1);
    }
}

seedArticles();
