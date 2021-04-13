module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(DatabaseChannel, message, args) {
        message.channel.send('Pong!');
    },
};