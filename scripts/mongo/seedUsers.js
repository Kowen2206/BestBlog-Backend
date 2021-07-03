// DEBUG=app:* node scripts/mongo/seedUsers.js

const bcrypt = require('bcryptjs');
const chalk = require('chalk');
const debug = require('debug')("app:scripts:users");
const MongoLib = require('../../lib/mongo');
const { config } = require('../../config/index');

const users = [
  {
    email: 'root@undefined.sh',
    name: 'ROOT',
    password: config.defaultAdminPassword,
    isAdmin: true
  },
  {
    email: 'jose@undefined.sh',
    name: 'Jose Maria',
    password: config.defaultUserPassword
  },
  {
    email: 'maria@undefined.sh',
    name: 'Maria Jose',
    password: config.defaultUserPassword
  }
];

async function createUser(mongoDB, user) {
  
  const { name, email, password, isAdmin } = user;
  debug(chalk.green(password + " " + email))
  const hashedPassword = await bcrypt.hash(password, 10);
 
  
  debug(chalk.blue("mmmm3"))
  const userId = await mongoDB.create('users', {
    name,
    email,
    password: hashedPassword,
    isAdmin: Boolean(isAdmin)
  });
  
  return userId;
}

async function seedUsers() {
  try {
    debug(chalk.blue("mmmm"))
    const mongoDB = new MongoLib();
    
    const promises = users.map(async user => {
      debug(chalk.green(user))
      const userId = await createUser(mongoDB, user);
      debug(chalk.green('User created with id:', userId));
    });

    await Promise.all(promises);
    debug(chalk.red(promises) + "it gots here too");
    return process.exit(0);
  } catch (error) {
    debug(chalk.red(error) + "it gots here");
    process.exit(1);
  }
}

seedUsers();