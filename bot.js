const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

var Guild = null;
var DatabaseChannel = null;

client.commands = new Discord.Collection();

loadAllCommands(client);

client.on('ready', () => {
    if (checkGuild(client)) {
        checkDatabaseChannel();

        DatabaseChannel.send("Beep Boop! Setting Up Database")
            .catch(console.error);

        console.log(`Logged in as ${client.user.tag}!`);
    }
});

client.on('message', msg => {
    if (!msg.content.startsWith('!') || msg.author.bot) return;

    const args = msg.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(msg, args);
    }
    catch (error) {
        console.error(error);
        msg.reply("Something wen't wrong whilst executing that command");
    }

});

client.login(process.env.token);

//Utility Functions
function loadAllCommands(client) {
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
}

function checkGuild(client) {
    var guild = client.guilds.find(guild => guild.name === "Modelling Roundup");
    if (guild != null) {
        Guild = guild;
        return true;
    }

    console.log("Bot is being used in incorrect Guild! Shutting Down!...");
    client.destroy();
    return false;
}

function checkDatabaseChannel() {
    var channel = Guild.channels.cache.find(channel => channel.name === "bot-database");
    if (channel == null) {
        console.log("couldnt find database channel - creating new channel");
        Guild.channels.create("bot-database", { reason: "Bot needs a database channel!", type: "text" })
            .then(newChannel => DatabaseChannel = newChannel)
            .catch(console.error);
    }
    else {
        console.log("found channel");
        DatabaseChannel = channel;
    }
}