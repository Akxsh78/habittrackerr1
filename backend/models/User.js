const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['online', 'offline'], default: 'offline' },
    lastLogin: { type: Date },
    lastLogout: { type: Date },
    role: { type: String, default: 'user' },
    totalPoints: { type: Number, default: 0 },
    badges: [{
        name: String,
        description: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
