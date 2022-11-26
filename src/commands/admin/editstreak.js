const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const mongoose = require('mongoose');
const User = require('../../schema/user');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('editstreak')
        .setDescription("[ADMIN] Add or Minus user's streaks")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption((option) => {
            return option
                .setName('username')
                .setRequired(true)
                .setDescription('The username to add streak');
        })
        .addIntegerOption((option) => {
            return option
                .setName('streak')
                .setRequired(true)
                .setDescription('Streak to add/minus');
        }),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true,
            ephemeral: true,
        });
        let operator = '';
        const argUsername = interaction.options.get('username');
        const argStreak = interaction.options.get('streak').value;
        //console.log(argUsername.user.username);

        // Edit targeted user's streak and update to db
        const updateUserStreak = await User.findOne({
            userId: argUsername.value,
        })
            .updateOne({ $inc: { streak: argStreak } })
            .catch((error) => console.error(error));

        // Just to beautify the reply
        if (argStreak > 0) {
            operator = '+';
        }

        await interaction.editReply({
            content: `${operator}${argStreak} ${argUsername.user.username}'s streak`,
        });
    },
};
