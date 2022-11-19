// Require the necessary discord.js classes
require("dotenv").config();
const fs = require("node:fs");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { token, clientId, guildId } = process.env;

// Create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});
client.commands = new Collection();
client.commandArray = [];

const functionPath = fs.readdirSync("./src/functions");
for (const folder of functionPath) {
    const functionFiles = fs
        .readdirSync(`./src/functions/${folder}`)
        .filter((file) => file.endsWith(".js"));

    for (const file of functionFiles) {
        require(`./functions/${folder}/${file}`)(client);
    }
}

client.eventHandler();
client.commandHandler();

client.on("messageCreate", (message) => {
    if (message.channel.id != "1042860383720968242") return;

    message.channel.messages.fetch({ limit: 1 }).then((msg) => {
        // NOTE: This is a workaround to get other msg by key and get
        // let x;
        // x = msg.keyAt(0);
        // console.log(msg.keys());
        // console.log(x);
        // console.log(msg.get(x));

        // NOTE: Alternatively, we can also use map function to access the Collection
        // let arr = [];
        // msg.map(m => {
        //     arr.push(m.content);
        //     arr.push(m.author.id);
        //     arr.push(m.author.username);

        // })
        //console.log("Array: " + arr);

        //TODO: Check if there is attachment in the message (using size)
        const attSize = msg.first().attachments.size;
        console.log(attSize);
        if (attSize === 0) {
            return;
        } else {
            // NOTE: References
            // console.log(msg);
            // console.log(msg.first().content);
            // console.log(msg.first().author.username);
            // console.log(msg.first().author.id);

            // WIP: Time checking
            // Problem: Not all user have the same timezone.
            // Possible solution 1: Assign a global timezone for discord bot.
            // Possible solution 2: Store user's timezone in db and check if the time is still within the 24 hours by comparing the current time and last shots sent.
            var d = new Date();
            console.log(d.toLocaleTimeString());
            console.log(d.toLocaleString());
            console.log(d.toLocaleDateString());

            // TODO: Check user's message has content type attachment image/png or image/jpeg
            const attContentType = msg.first().attachments.first().contentType;
            console.log(attContentType);
            if(attContentType === "image/png") {
                console.log("This is png");
            }
            else if(attContentType === "image/jpeg") {
                console.log("This is jpg");
            }
        }

        

        //const attContentType = msg.first().attachments.first().contentType;

        //console.log(msg.first().attachments.first().contentType);

        //console.log(msg.attachments.map(k => console.log(k)));
        // if(message.author.id) {
        //     console.log('Delete message because sent 2 messages in a row');
        //     message.delete();
        // }
    });
});

// Log in to Discord with your client's token
client.login(token);
