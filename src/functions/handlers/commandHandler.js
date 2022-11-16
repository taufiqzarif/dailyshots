require('dotenv').config;
const { REST, Routes } = require('discord.js');
const { token, clientId } = process.env;
const fs = require('fs');

module.exports = (client) => {
    client.commandHandler = async () => {
        const commandPath = fs.readdirSync('./src/commands');
        for (const folder of commandPath) {
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith('.js'));

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
                console.log(`Command ${command.data.name} added to bot!`);
            }
        }

        const rest = new REST({ version: '10' }).setToken(token);

        try {
            console.log(
                `Started refreshing ${client.commandArray.length} application (/) commands.`
            );

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: client.commandArray }
            );

            console.log(
                `Successfully reloaded ${data.length} application (/) commands.`
            );
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    };
};
