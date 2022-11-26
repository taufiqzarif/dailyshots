const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const mongoose = require('mongoose');
const User = require('../../schema/user');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testdb')
        .setDescription('[ADMIN] Test the db')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        await interaction.deferReply({
            fetchReply: true,
            ephemeral: true,
        });
        let userProfile = await User.findOne({ userId: interaction.user.id });
        if (!userProfile) {
            userProfile = await new User({
                _id: mongoose.Types.ObjectId(),
                userId: interaction.user.id,
                streak: 0,
                lastSent: null,
                isShots: false,
            });
            await userProfile.save().catch(console.error);
            await interaction.editReply({
                content: `User Id: ${userProfile.userId}`,
            });
            console.log(userProfile);
        } else {
            await interaction.editReply({
                content: `Userid: ${userProfile.userId}\nStreak: ${userProfile.streak}\nLast Sent: ${userProfile.lastSent}\nIs Shots: ${userProfile.isShots}`,
            });
        }
    },
};
