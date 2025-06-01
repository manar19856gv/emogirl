const { 
    Client, 
    intents, 
    Collection, 
    MessageEmbed, 
    MessageAttachment, 
    MessageActionRow, 
    MessageButton,
    MessageSelectMenu, 
    Permissions  
  } = require("discord.js");
  
  const client = new Client({ intents: 32767 });
  
  const express = require('express');
  const app = express();
  
  app.get('/', (req, res) => {
    res.send('Hello Express app!');
  });
  
  app.listen(3000, () => {
    console.log('Server Started');
  });
  
  function loadAliasesToBot() {
  }
  
  const fs = require("fs");
  const ms = require(`ms`);
  const Discord = require("discord.js");
  const { prefix, owners, Guild } = require(`${process.cwd()}/config`);
  const config = require(`${process.cwd()}/config`);
  const Data = require("pro.db");
  const { createCanvas, registerFont } = require("canvas");
  const canvas = require('canvas');
  
   process.on("unhandledRejection", (reason, promise) => { return })
   process.on("uncaughtException", (err, origin) => { return })
  process.on('uncaughtExceptionMonitor', (err, origin) => { return });
  process.on('multipleResolves', (type, promise, reason) => { return })

  module.exports = client;
  
  client.commands = new Collection();
  client.slashCommands = new Collection();
  client.config = require(`${process.cwd()}/config`);
  require("./handler")(client);
  client.prefix = prefix;
  client.login(config.token);
  

  client.on('ready', () => { 
    client.user.setActivity("ero", {type: "STREAMING", url: "https://discord.gg/Lva"})
  });


  require("events").EventEmitter.defaultMaxListeners = 9999999;
  
  fs.readdir(`${__dirname}/events/`, (err, folders) => {
      if (err) return console.error(err);
  
      folders.forEach(folder => {
          if (folder.includes('.')) return;
  
          fs.readdir(`${__dirname}/events/${folder}`, (err, files) => {
              if (err) return console.error(err);
  
              files.forEach(file => {
                  if (!file.endsWith('.js')) return;
  
                  let eventName = file.split('.')[0];
                  let eventPath = `${__dirname}/events/${folder}/${file}`;
  
                  try {
                      let event = require(eventPath);
                      client.on(eventName, event.bind(null, client));
                  } catch (error) {
                  }
              });
          });
      });
  });
