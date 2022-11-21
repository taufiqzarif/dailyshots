const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const User = require("../../schema/user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("streak")
        .setDescription("Show your current streak"),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true,
        });
        let newMessage = "";
        let userData = await User.findOne({ userId: interaction.user.id });
        if (!userData) {
            newMessage = `Could not find ${interaction.user.id} in database!`;
        } else {
            newMessage = `Your current streak is 🎉 ${userData.streak} days`;
        }

        await interaction.editReply({
            content: newMessage,
        });
    },
};
