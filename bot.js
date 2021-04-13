const fs = require('fs');
const Discord = require('discord.js');
const Client = new Discord.Client();

var Context = {
    Guild: null,
    DatabaseChannel: null,
    previousChallenge: {
        Genre: null,
        AssetType: null,
        SubType: null,
    }
};

loadAllCommands();

Client.on('ready', () => {
    if (checkGuild()) {
        checkDatabaseChannel();
        retrievePreviousChallenge();


        console.log(`Logged in as ${Client.user.tag}!`);
    }
});

Client.on('message', msg => {
    if (!msg.content.startsWith('!') || msg.author.bot) return;

    const args = msg.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!Client.commands.has(command)) return;

    try {
        Client.commands.get(command).execute(DatabaseChannel, msg, args);
    }
    catch (error) {
        console.error(error);
        msg.reply("Something wen't wrong whilst executing that command");
    }

});

Client.login(process.env.token);

//Utility Functions
function loadAllCommands() {
    Client.commands = new Discord.Collection();

    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        Client.commands.set(command.name, command);
    }
}

function checkGuild() {
    var guild = Client.guilds.cache.find(guild => guild.name === "Modelling Roundup");
    if (guild != null) {
        Context.Guild = guild;
        return true;
    }

    console.log("Bot is being used in incorrect Guild! Shutting Down!...");
    Client.destroy();
    return false;
}

function checkDatabaseChannel() {
    var channel = Context.Guild.channels.cache.find(channel => channel.name === "bot-database");
    if (channel == null) {
        console.log("couldnt find database channel - creating new channel");
        Context.Guild.channels.create("bot-database", { reason: "Bot needs a database channel!", type: "text" })
            .then(newChannel => {
                Context.DatabaseChannel = newChannel;
                Context.DatabaseChannel.send("Beep Boop! Setting Up Database")
                    .catch(console.error);
            })
            .catch(console.error);
    }
    else {
        console.log("found channel");
        Context.DatabaseChannel = channel;
    }
}

function retrievePreviousChallenge() {
    var messageList = Context.DatabaseChannel.messages.cache.sorted((msgOne, msgTwo) => msgTwo.createdAt - msgOne.createdAt);

    var embedList = messageList.map(msg => msg.embeds.find(embed => embed.title === "This weeks challenge!")).filter(embed => embed);

    var recentEmbed = embedList[0];
    recentEmbed.fields.forEach(element => {
        Context.previousChannel[element.name] = element.value;
    });

    console.log("Previous Challenge");
    console.log(JSON.stringify(Context.previousChallenge))
}