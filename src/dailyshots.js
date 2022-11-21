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
    if (message.channel.id != "1042860383720968242" && !message.author.bot)
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

        //TODO: Check if there is attachment in the message (using size)
        const attSize = msg.first().attachments.size;
        //console.log(attSize);
        if (attSize === 0) {
            return;
        } else {
            // WIP: Time checking
            // Problem: Not all user have the same timezone.
            // Possible solution 1: Assign a global timezone for discord bot.
            // Possible solution 2: Store user's timezone in db and check if the time is still within the 24 hours by comparing the current time and last shots sent.

            // Solution 1A: Using Date()
            // var d = new Date();
            // console.log(d.toLocaleTimeString());
            // console.log(d.toLocaleString());
            // console.log(d.toLocaleDateString());

            // Solution 1B: Using moment
            var currentDate = moment();
            const userId = msg.first().author.id;
            const userName = msg.first().author.username;

            let userData = await User.findOne({
                userId: userId,
            });
            var checkIsNextDay = await getTimeDiff(userId);
            console.log(chalk.red(checkIsNextDay));
            if (userData.isShots && checkIsNextDay < 60000) {
                console.log(chalk.magenta("Already shots today!"));
                return;
            }
            if (!userData) {
                console.log(
                    chalk.magenta(
                        `User ID: ${userId} not found!\nUsername: ${userName}`
                    )
                );
                console.log(chalk.blue(`[Adding ${userName} to db...]`));
                userData = await User.create({
                    _id: mongoose.Types.ObjectId(),
                    userId: userId,
                    streak: 0,
                    lastSent: null,
                    isShots: false,
                });
            }

            const updateUserLastSent = await User.findOne({
                userId: userId,
            }).updateOne({ lastSent: currentDate.toISOString() });
            console.log("Updated last sent!");

            // setTimeout(() => {
            //     var minuteDate = moment();
            //     console.log("message sent: " + currentDate.format("h:mm:ssA"));
            //     console.log("time now: " + minuteDate.format("h:mm:ssA"));
            //     console.log(
            //         "time passed: " + moment().add(1, "days").diff(currentDate)
            //     );
            // }, 1000); //60000

            // DONE: Check user's message has content type attachment image/png or image/jpeg
            const attContentType = msg.first().attachments.first().contentType;
            console.log(attContentType);
            if (attContentType === "image/png") {
                console.log("This is png");
            } else if (attContentType === "image/jpeg") {
                console.log("This is jpg");
            } else if (attContentType === "video/mp4") {
                console.log("This is mp4");
            }

            console.log(chalk.red(checkIsNextDay));
            if (checkIsNextDay > 60000) {
                console.log(chalk.cyan(checkIsNextDay));
                console.log("More than 24 hours!");
                if (userData.isShots) {
                    const updateUserIsShots = await User.findOne({
                        userId: userId,
                    }).updateOne({ isShots: false });
                }
                if (userData.streak != 0) {
                    const updateUserStreak = await User.findOne({
                        userId: userId,
                    }).updateOne({ $inc: { streak: -1 } });
                }
            } else {
                console.log(chalk.cyan(checkIsNextDay));
                console.log("Less than 24 hours!");
                console.log(chalk.yellow("Updating isShots ... "));
                const updateUserIsShots = await User.findOne({
                    userId: userId,
                }).updateOne({ isShots: true });
                console.log(chalk.green("Updated isShots!"));

                console.log(chalk.yellow("Updating streak ... "));
                const updateUserStreak = await User.findOne({
                    userId: userId,
                }).updateOne({ $inc: { streak: 1 } });
                console.log(chalk.green("Updated streak!"));
            }
        }
    });
});

async function getTimeDiff(userId) {
    var currentTime = moment();
    let userData = await User.findOne({
        userId: userId,
    });
    let userLastSent = userData.lastSent;
    console.log(`User last sent: ${userLastSent}`);

    // Testing purposes
    //var timeDiff = moment().add(1, "days").diff(userLastSent);
    //console.log("Time passed: " + moment().add(1, "days").diff(userLastSent));

    var timeDiff = currentTime.diff(userLastSent);
    return timeDiff;
}

// Log in to Discord with your client's token
client.login(token);
(async () => {
    await connect(dbToken).catch((err) => console.error(err));
})();
