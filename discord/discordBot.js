const Discord = require('discord.js');

const client = new Discord.Client();
const TOKEN = 'ODAzNDA1MzQ0Njg0Mzc2MDY2.YA9TiA.YU7kGPDObsE2aeJ1wxsHAqB3HbM';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username} #${client.user.discriminator}`);
});

client.on('message', msg => {
  if(msg.content === '!ping')
    msg.channel.send('pong');
});

client.login(TOKEN);

