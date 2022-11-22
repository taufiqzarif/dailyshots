// Require the necessary discord.js classes
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./schema/user");
const chalk = require("chalk");
const moment = require("moment");
const fs = require("node:fs");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { connect } = require("mongoose");
const { token, clientId, guildId, dbToken } = process.env;

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
    if (message.channel.id != "1039459742961115136" && !message.author.bot)
        return;

    message.channel.messages.fetch({ limit: 1 }).then(async (msg) => {
        // NOTE: References for access collection
        //console.log(msg);
        // console.log(msg.first().content);
        // console.log(msg.first().author.username);
        // console.log(msg.first().author.id);

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

        // Check if there is attachment in the message by using size properties
        const attSize = msg.first().attachments.size;

        if (attSize === 0) {
            return;
        } else {
            // ? Check hidden imposter file OR limit size to only one attachment
            if (attSize > 1) {
                let isImposter = false;
                msg.first().attachments.map((att) => {
                    if (
                        att.contentType != "image/png" &&
                        att.contentType != "image/jpeg" &&
                        att.contentType != "video/mp4" &&
                        att.contentType != "video/quicktime"
                    ) {
                        console.log(chalk.red("IMPOSTER FOUND!"));
                        isImposter = true;
                        message.delete();
                    }
                });
                if (isImposter) {
                    return;
                }
            }

            // Check user's message has content type attachment image/png or image/jpeg or video/mp4
            const attContentType = msg.first().attachments.first().contentType;
            console.log(attContentType);
            if (
                attContentType != "image/png" &&
                attContentType != "image/jpeg" &&
                attContentType != "video/mp4" &&
                attContentType != "video/quicktime"
            ) {
                console.log(chalk.red("INVALID FORMAT!"));
                message.delete();
                return;
            }

            // Time Logic System
            let currentDate = moment();
            const userId = msg.first().author.id;
            const userName = msg.first().author.username;

            let userData = await User.findOne({
                userId: userId,
            });

            if (!userData) {
                console.log(
                    chalk.magenta(
                        `User ID: ${userId} not found!\nUsername: ${userName}`
                    )
                );
                console.log(chalk.yellow(`[Adding ${userName} to db...]`));
                userData = await new User({
                    _id: mongoose.Types.ObjectId(),
                    userId: userId,
                    streak: 0,
                    lastSent: null,
                    isShots: false,
                });
                await userData.save().catch(console.error);
                console.log(chalk.green(`[ADDED ${userName}]`));
            }

            let checkIsNextDay = await getTimeDiff(userId);
            console.log(chalk.magenta(checkIsNextDay));

            if (checkIsNextDay < 57000000 && userData.lastSent != null) {
                console.log(chalk.magenta("Already sent shots today!"));
                return;
            }

            // Immediately updates the user's last sent shots in db
            const updateUserLastSent = await User.findOne({
                userId: userId,
            }).updateOne({ lastSent: currentDate.toISOString() });

            // Reward & Penalty System
            if (checkIsNextDay > 86000000) {
                // Penalize the user (Did not send shots more than 24 hours)
                console.log(chalk.red("USER PENALIZED!"));
                if (userData.streak != 0) {
                    const updateUserStreak = await User.findOne({
                        userId: userId,
                    }).updateOne({ streak: 0 });
                }
            } else if (checkIsNextDay > 57000000 || userData.lastSent == null) {
                // Reward the user (Sent shots within 24 hours)
                console.log(chalk.green("USER REWARDED!"));
                const updateUserStreak = await User.findOne({
                    userId: userId,
                }).updateOne({ $inc: { streak: 1 } });
            }
        }
    });
});

async function getTimeDiff(userId) {
    let currentTime = moment();
    let userData = await User.findOne({
        userId: userId,
    });
    let userLastSent = userData.lastSent;
    //console.log(`User last sent: ${userLastSent}`);

    // Testing purposes
    //let timeDiff = moment().add(1, "days").diff(userLastSent);
    //console.log("Time passed: " + moment().add(1, "days").diff(userLastSent));

    let timeDiff = currentTime.diff(userLastSent);
    return timeDiff;
}

// Log in to Discord with your client's token
client.login(process.env.token);
(async () => {
    await connect(process.env.dbToken).catch((err) => console.error(err));
})();
