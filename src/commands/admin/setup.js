const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("[ADMIN] Setup DailyShots")
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
