const db = require("pro.db");
const { owners } = require(`${process.cwd()}/config`);

module.exports = {
  name: "setlog",
  description: "Set up server logs",
  usage: "!setlogs",
  run: async (client, message, args) => {

    if (!owners.includes(message.author.id)) return message.react('❌');
    const isEnabled = db.get(`command_enabled_${module.exports.name}`);
    if (isEnabled === false) {
        return; 
    }

    try {
      // Check if the user has permission to use this command

      // Create a new category named "Server Logs"
      const category = await message.guild.channels.create("Server Logs", {
        type: "GUILD_CATEGORY",
        reason: "Setting up server logs category",
        VIEW_CHANNEL: false
      });

      // Create different types of logs channels under the "Server Logs" category
      const channels = [
        { name: "log-messages", key: "channelmessage" },
        { name: "log-pic", key: "logpic" },
        { name: "log-channels", key: "logchannels" },
        { name: "log-nickname", key: "lognickname" },
        { name: "log-join-leave", key: "logjoinleave" },
        { name: "log-links", key: "loglinks" },
        { name: "log-bots", key: "logbots" },
        { name: "log-roles", key: "logroles" },
        { name: "log-vjoin-vexit", key: "logvjoinvexit" },
        { name: "log-move", key: "logmove" },
        { name: "log-ban-unban", key: "logbanunban" },
        { name: "log-kick", key: "logkick" },
        { name: "log-add-remove-emoji", key: "logemoji" },
        { name: "log-prison-unprison", key: "logprisonunprison" },
        { name: "log-warns", key: "logwarns" },
        { name: "log-tmute-untmute", key: "logtmuteuntmute" }

      ];

      for (const { name, key } of channels) {
        const channel = await message.guild.channels.create(name, {
          type: "GUILD_TEXT",
          parent: category,
          reason: `Setting up server logs channel for ${name}`,
          VIEW_CHANNEL: false
        });
        await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          VIEW_CHANNEL: false
        });
        db.set(`${key}_${message.guild.id}`, channel.id);
      }

      message.react("✅"); // React to indicate successful setup
    } catch (error) {
      console.error("Error occurred in setting up server logs:", error);
    }
  }
};
