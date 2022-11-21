const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        const ping = message.createdTimestamp - interaction.createdTimestamp;
        const latency = client.ws.ping;
        await interaction.editReply({content: `Client Ping🏓: ${ping}ms\nAPI Latency🏓: ${latency}ms`});
    },
};
