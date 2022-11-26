const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setnickname')
        .setDescription('[ADMIN] Test set nickname command')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption((option) => {
            return option
                .setName('username')
                .setRequired(true)
                .setDescription('The username to add streak');
        })
        .addStringOption((option) => {
            return option
                .setName('nick')
                .setRequired(true)
                .setDescription('Change nickname');
        }),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true,
            ephemeral: true,
        });
        const argUsername = interaction.options.get('username');
        const argNewNick = interaction.options.get('nick');
        const member = interaction.guild.members.cache.get(argUsername.value);
        console.log(member);
        await member.setNickname(
            `${argUsername.user.username} ${argNewNick.value}`
        );

        await interaction.editReply({
            content: 'Nickname changed!',
        });
    },
};
