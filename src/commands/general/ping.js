const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        const latency = Math.abs(Date.now() - interaction.createdTimestamp);
        const ping = interaction.client.ws.ping;
        await interaction.editReply({content: `Latency🏓: ${latency}ms\nPing🏓: ${ping}ms`});
    },
};
