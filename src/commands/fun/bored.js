// const { SlashCommandBuilder } = require('discord.js');
// const { EmbedBuilder } = require('discord.js');
// const axios = require('axios');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('meme')
//         .setDescription('Send random meme'),
//     async execute(interaction) {
//         // const message = await interaction.deferReply({
//         //     fetchReply: true
//         // });
//         const url = 'https://some-random-api.ml/meme';

//         let response;
//         try {
//             response = await axios.get(url);
//             // console.log(response.data);
//         } catch(e) {
//             console.log(e);
//         }

//         const embed = new EmbedBuilder()
//         .setTitle('Meme')
//         .setDescription(response.data.caption)
//         .setImage(response.data.image)

//         await interaction.reply({embeds: [embed]});
//     }
// };
const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const { request } = require("undici");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bored")
        .setDescription("Send random meme"),
    async execute(interaction) {
        const url = 'http://www.boredapi.com/api/activity?type=relaxation';

        let response;
        try {
            response = await axios.get(url);
            // console.log(response.data);
        } catch (err) {
            console.error(err);
        }

        const botLatency = Date.now() - interaction.createdTimestamp;
        const ping = interaction.client.ws.ping;

        const embed = new EmbedBuilder()
        .setDescription(response.data.activity)
        .setFields(
            { name: "Latency🏓", value: `${botLatency}ms`, inline: true },
            { name: "API Latency🏓", value: `${ping}ms`, inline: true },
        )
        

        await interaction.reply({embeds: [embed]});
    },
};
