const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    loginTime: { type: Date, required: true, default: Date.now },
    logoutTime: { type: Date },
    status: { type: String, enum: ['online', 'offline'], default: 'online' }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
