const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription("Replies user's info"),
    async execute(interaction) {
        const message = await interaction.deferReply({
            fetchReply: true,
        });
        const newMessage = interaction.user.tag;
        await interaction.editReply({ content: newMessage, ephemeral: true });
    },
};
