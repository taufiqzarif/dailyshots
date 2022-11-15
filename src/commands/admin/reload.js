const {
    SlashCommandBuilder,
    PermissionsBitField,
    REST,
    Routes,
} = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reloads the commands [Discord Bot Owner Only]!")
        .addStringOption((option) => {
            return option
                .setName("category")
                .setRequired(true)
                .setDescription("The subfolder name");
        })
        .addStringOption((option) => {
            return option
                .setName("command")
                .setRequired(true)
                .setDescription("The command name");
        }),
    async execute(interaction) {
        if (
            !interaction.member.permissions.has(
                PermissionsBitField.Flags.KickMembers
            )
        ) {
            return await interaction.reply(
                "You do not have permission to use this command."
            );
        }
        await interaction.deferReply();
        const argCategory = interaction.options.getString("category");
        const argCommand = interaction.options.getString("command");

        await interaction.editReply(`Reloaded! ${argCategory} , ${argCommand}`);
    },
};
