// Require the necessary discord.js classes
const dotenv = require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ClientUser } = require('discord.js');
const { readdir } = require('node:fs');
const { token, clientId, guildId } = process.env;

console.log(token, clientId, guildId);

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


// const eventsPath = path.join(__dirname, 'events');
// const eventFiles = fs
//     .readdirSync(eventsPath)
//     .filter((file) => file.endsWith('.js'));

// for (const file of eventFiles) {
//     const filePath = path.join(eventsPath, file);
//     const event = require(filePath);
//     if (event.once) {
//         client.once(event.name, (...args) => event.execute(...args));
//     } else {
//         client.on(event.name, (...args) => event.execute(...args));
//     }
// }

// const commandsPath = path.join(__dirname, './commands/');
// console.log(commandsPath);
// let folders = fs.readdirSync(commandsPath);
// folders.forEach((sub) => {
//     const commandFiles = fs
//         .readdirSync(commandsPath + sub + '/')
//         .filter((file) => file.endsWith('.js'));
//     console.log(commandFiles);

//     for (const file of commandFiles) {
//         const filePath = path.join(`${commandsPath}/${sub}/${file}`);
//         // console.log("Filepath:",filePath);
//         const command = require(filePath);

//         // Set a new item in the Collection with the key as the command name and the value as the exported module
//         if ('data' in command && 'execute' in command) {
//             client.commands.set(command.data.name, command);
//         } else {
//             console.log(
//                 `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
//             );
//         }
//     }
// });

// const folders = readdir("./commands/");
// folders.forEach(subFolder => {
//     const commandFiles = fs.readdirSync('./commands/' + subFolder + "/").filter(file => file.endsWith('.js'));
//     console.log(commandFiles);
//     for(const file of commandFiles) {
//         const command = require(`./commands/${subFolder}/${file}`);
//         if("data" in command && "execute" in command) {
//             client.commands.set(command.data.name, command);
//         } else {
//             console.log(`[WARNING] The command at ${commandFiles} is missing a required "data" or "execute" property.`);
//         }
//     }
// })

// client.on(Events.InteractionCreate, async (interaction) => {
//     if (!interaction.isChatInputCommand()) return;

//     const command = interaction.client.commands.get(interaction.commandName);

//     if (!command) {
//         console.error(
//             `No command matching ${interaction.commandName} was found.`
//         );
//         return;
//     }

//     try {
//         await command.execute(interaction);
//     } catch (error) {
//         console.error(error);
//         await interaction.reply({
//             content: 'There was an error while executing this command!',
//             ephemeral: true,
//         });
//     }

//     console.log(interaction);
// });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
// client.once(Events.ClientReady, (c) => {
//     console.log(`Ready!`);
// });

// Log in to Discord with your client's token
client.login(token);
