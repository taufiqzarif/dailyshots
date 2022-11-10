const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('streak')
        .setDescription('Shows the streak of a user.'),
    async execute(interaction, client) {
        await interaction.deferReply();
        const user = interaction.options.getMember('target');
        await interaction.editReply(user);
    },
};
