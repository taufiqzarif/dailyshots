const { ActivityType } = require('discord.js');

module.exports = (client) => {
    client.pickPresense = async () => {
        const options = [
            {
                type: ActivityType.Watching,
                text: 'Developed by alyph#0001',
                url: "https://www.github.com/taufiqzarif"
            },
        ];

        const option = Math.floor(Math.random() * options.length);
        await client.user.setPresence({
            activities: [
                {
                    name: options[option].text,
                    type: options[option].type,
                    url: options[option].url,
                },
            ],
            status: 'dnd',
        });
    };
};
