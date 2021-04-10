const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();

//Dynamically load all commands from their respective files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
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