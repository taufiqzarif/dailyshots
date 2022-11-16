const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Send random meme'),
    async execute(interaction) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        const url = 'https://some-random-api.ml/meme';

        let response;
        try {
            response = await axios.get(url);
            // console.log(response.data);
        } catch(e) {
            console.log(e);
        }

        const embed = new EmbedBuilder()
        .setTitle('Meme')
        .setDescription(response.data.caption)
        .setImage(response.data.image)

        await interaction.editReply({embeds: [embed]});
    }
};