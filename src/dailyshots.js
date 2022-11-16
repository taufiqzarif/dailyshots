// Require the necessary discord.js classes
require('dotenv').config();
const fs = require('node:fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, clientId, guildId } = process.env;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
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

// Log in to Discord with your client's token
client.login(token);
