const {Events} = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if(interaction.isChatInputCommand()) {
            const {commands} = client;
            const {commandName} = interaction;
            const command = commands.get(commandName);

            if(!command) {
                console.error(`No command matching ${commandName} was found!`);
                return;
            }

            try {
                await command.execute(interaction, client);
            }
            catch(error) {
                console.error(`Error executing ${commandName}!`);
                console.error(error);
                await interaction.reply({
                    content: `Error executing ${commandName}`,
                    ephemeral: true
                });
            }
        }
    }
}



// const { Events } = require('discord.js');

// module.exports = {
// 	name: Events.InteractionCreate,
// 	async execute(interaction) {
// 		if (!interaction.isChatInputCommand()) return;

// 		const command = interaction.client.commands.get(interaction.commandName);

// 		if (!command) {
// 			console.error(`No command matching ${interaction.commandName} was found.`);
// 			return;
// 		}

// 		if(command.developer && interaction.user.id !== "834638969945587712"){
// 			return await interaction.reply({
// 				content: "This command can only be used by developer.",
// 				ephemeral: true
// 			})
// 		}

// 		try {
// 			await command.execute(interaction);
// 		} catch (error) {
// 			console.error(`Error executing ${interaction.commandName}`);
// 			console.error(error);
// 		}
// 	},
// };