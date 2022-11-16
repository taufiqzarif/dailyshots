const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        await interaction.editReply('Pong!');
    },
};
