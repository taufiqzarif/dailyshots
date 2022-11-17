const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addstreak")
        .setDescription("[ADMIN] Add user's streaks")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true,
        });

        await interaction.editReply({
            content: "Add streak ADMIN",
            ephemeral: true,
        });
    },
};
