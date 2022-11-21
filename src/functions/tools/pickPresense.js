const { ActivityType } = require('discord.js');

module.exports = (client) => {
    client.pickPresense = async () => {
        const options = [
            {
                type: ActivityType.Watching,
                text: 'alyph#0001 develop',
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
