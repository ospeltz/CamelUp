const Discord = require('discord.js');
const emojis = require('./emojis.json');
const config = require('../config.json');
const { MongodbInteractor } = require('../mongodbInteractor.js');
const { CommandHandler } = require('./commandHandler.js');

const client = new Discord.Client();
const TOKEN = config.discordToken;

const mongodbInteractor = new MongodbInteractor(config.mongodbURL);
const commandHandler = new CommandHandler(mongodbInteractor);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username} #${client.user.discriminator}`);
});

client.on('message', message => {
  if(!message.content.startsWith(config.prefix) || message.author.bot)
    return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  console.log(`COMMAND: ${command} ARGS: ${args.join()}`);
  try {
    commandHandler.handleCommand(message, command, args);
  }
  catch(err) {
    console.error(err)
    message.reply(err.message)
  }
  //message.delete();
  

});


client.login(TOKEN);


