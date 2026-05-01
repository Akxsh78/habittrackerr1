const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "Health" },
    frequency: { type: String, default: "Daily" },
    startDate: { type: Date, default: Date.now },
    color: { type: String, default: "#7c5cfc" },
    icon: { type: String, default: "⭐" },
    reminder: {
        enabled: { type: Boolean, default: false },
        time: { type: String, default: "09:00" }
    },
    completions: [{
        date: { type: String, required: true } // "YYYY-MM-DD"
    }],
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalCompletions: { type: Number, default: 0 }
});

module.exports = mongoose.model("Habit", habitSchema);