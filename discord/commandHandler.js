const emojis = require('./emojis.json');
const { MessageEmbed, MessageAttachment } = require('discord.js')

class CommandHandler{
  constructor(mongodbInteractor) {
    this.mongodbInteractor = mongodbInteractor;
  }

  handleCommand(message, command, args) {
    switch (command) {
      case 'play': {
        this.#play(message, args).then(selection => {
          switch (selection) {
            case 0: {
              this.#bet(message, args);
              break;
            }
            case 1: {
              this.#roll(message, args);
              break;
            }
            case 2: {
              this.#spectate(message, args);
              break;
            }
            case 3: {
              this.#partner(message, args);
              break;
            }
            default: {
              message.channel.send('Invalid selection');
              break;
            }
          }
        });
        break;
      }

      case 'bet': {
        this.#bet(message, args);
        break;
      }

      case 'roll': {
        this.#roll(message, args);
        break;
      }

      case 'spectate': {
        this.#spectate(message, args);
        break;
      }

      case 'partner': {
        this.#partner(message, args);
        break;
      }

      case 'board': {
        this.#sendCurrentGameState(message, args);
        break;
      }

      default: {
        console.log(`command: ${command} not found`);
        break;
      }
    }
  }

  #play(message, args) {
    return message.channel.send(`Would you like to:
      ${emojis.numbers[1]} Bet
      ${emojis.numbers[2]} Roll
      ${emojis.numbers[3]} Spectate
      ${emojis.numbers[4]} Partner`)
    .then(async newMsg => {
      for(let i = 1; i <= 4; i++)
        await newMsg.react(emojis.numbers[i]);

      const filter = (reaction, user) => !user.bot; // this should also filter for valid reactions
      return newMsg.awaitReactions(filter, { max: 1 }).then(collected => {
        return this.#getSelectionFromReaction(newMsg, collected);
      });
    });
  }

  #bet(message, args) {
    message.reply(`you called the bet method ${args.length > 0?  `with arguments ${args.join()}`: ''}`);
  }

  #roll(message, args) {
    message.reply(`you called the roll method ${args.length > 0?  `with arguments ${args.join()}`: ''}`);
  }

  #spectate(message, args) {
    message.reply(`you called the spectate method ${args.length > 0?  `with arguments ${args.join()}`: ''}`);
  }

  #partner(message, args) {
    message.reply(`you called the partner method ${args.length > 0?  `with arguments ${args.join()}`: ''}`);
  }

  #getSelectionFromReaction(message, collected) {
    message.delete();
    if(!collected.first())
      throw new Error('timeout');
    const reaction = collected.first();
    const reactionEmoji = reaction._emoji.name;
    const selection = emojis.numbers.indexOf(reactionEmoji) - 1;
    return selection;
  }

  #sendCurrentGameState(message, args) {
    const attachment = new MessageAttachment('./exports/board.png', 'board.png');

    const embed = new MessageEmbed()
      .setTitle('The current board!')
      .attachFiles(attachment)
      .setImage('attachment://board.png')
      .addField('Test','This is a test field');

    message.channel.send(embed);
  }
}



module.exports = { CommandHandler };