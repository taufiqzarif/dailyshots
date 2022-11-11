const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('streak')
        .setDescription('Shows the streak of a user.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        // THE LOGIC
        // Sending an image per day will increment 1 of the user's streak points.
        // After 3 days of sending images in the channel, update and add an emoji 🔥 streak to the user's nickname.
        // User can enable disable the emoji nickname feature.
        const user = interaction.user.tag;
        await interaction.editReply(user);
    },
};