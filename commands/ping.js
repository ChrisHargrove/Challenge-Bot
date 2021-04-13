module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(Context, message, args) {
        message.channel.send('Pong!');
    },
};