const fs = require('fs');
const Discord = require('discord.js');
const Client = new Discord.Client();

var Guild = null;
var DatabaseChannel = null;

Client.commands = new Discord.Collection();

loadAllCommands();

Client.on('ready', () => {
    if (checkGuild()) {
        checkDatabaseChannel();



        console.log(`Logged in as ${Client.user.tag}!`);
    }
});

Client.on('message', msg => {
    if (!msg.content.startsWith('!') || msg.author.bot) return;

    const args = msg.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!Client.commands.has(command)) return;

    try {
        Client.commands.get(command).execute(msg, args);
    }
    catch (error) {
        console.error(error);
        msg.reply("Something wen't wrong whilst executing that command");
    }

});

Client.login(process.env.token);

//Utility Functions
function loadAllCommands() {
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        Client.commands.set(command.name, command);
    }
}

function checkGuild() {
    var guild = Client.guilds.cache.find(guild => guild.name === "Modelling Roundup");
    if (guild != null) {
        Guild = guild;
        return true;
    }

    console.log("Bot is being used in incorrect Guild! Shutting Down!...");
    Client.destroy();
    return false;
}

function checkDatabaseChannel() {
    var channel = Guild.channels.cache.find(channel => channel.name === "bot-database");
    if (channel == null) {
        console.log("couldnt find database channel - creating new channel");
        Guild.channels.create("bot-database", { reason: "Bot needs a database channel!", type: "text" })
            .then(newChannel => {
                DatabaseChannel = newChannel;
                DatabaseChannel.send("Beep Boop! Setting Up Database")
                    .catch(console.error);
            })
            .catch(console.error);
    }
    else {
        console.log("found channel");
        DatabaseChannel = channel;
    }
}