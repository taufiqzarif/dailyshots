// Require the necessary discord.js classes
require('dotenv').config();
const fs = require('node:fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, clientId, guildId } = process.env;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
client.commands = new Collection();
client.commandArray = [];

const functionPath = fs.readdirSync('./src/functions');
for (const folder of functionPath) {
    const functionFiles = fs
        .readdirSync(`./src/functions/${folder}`)
        .filter((file) => file.endsWith('.js'));
    
        for(const file of functionFiles) {
            require(`./functions/${folder}/${file}`)(client);
        }
}

client.eventHandler();
client.commandHandler();

client.on('messageCreate', message => {
    if(message.channel.id != '1042860383720968242') return;

    message.channel.messages.fetch({limit:1}).then(msg=>{
        //let firstAuthor = msg.author.id;
        console.log(msg.content);
        if(message.author.id) {
            console.log('Delete message because sent 2 messages in a row');
            message.delete();
        }
    })
})

// Log in to Discord with your client's token
client.login(token);
