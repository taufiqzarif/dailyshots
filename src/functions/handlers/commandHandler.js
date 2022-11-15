const fs = require('fs');

module.exports = (client) => {
    client.commandHandler = async () => {
        const commandPath = fs.readdirSync('./src/commands');
        for (const folder of commandPath) {
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith('.js'));

            const { commands, commandArray } = client;
            for(const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
                console.log(`Command ${command.data.name} added to bot!`);
            }
        }
    };
};
