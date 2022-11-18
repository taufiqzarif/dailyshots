const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('streak')
        .setDescription('Show your current streak'),
    async execute(interaction, client) {

        const channel = await client.channels.cache.get('1042860383720968242');
        channel.messages.fetch({ limit: 2 }).then(messages => {
            console.log(`Received ${messages.size} messages`);
            //Iterate through the messages here with the variable "messages".
            messages.forEach(message => console.log(message.attachments.first()));
          })

        const message = await interaction.deferReply({
            fetchReply: true,
        });

        const streakCount = '2';

        await interaction.editReply({
            content: `Your current streak is ${streakCount} days`
        })
    }
}