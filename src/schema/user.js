const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: String,
    streak: { type: Number, required: false },
    lastSent: { type: String, required: false },
    isShots: { type: Boolean, required: false },
});

module.exports = model("User", userSchema, "users");
