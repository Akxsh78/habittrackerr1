const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const authMiddleware = require("../middleware/authMiddleware");

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid User" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        
        // Update user status and lastLogin
        user.status = 'online';
        user.lastLogin = new Date();
        await user.save();

        // Create activity log
        await ActivityLog.create({
            user: user._id,
            username: user.username,
            status: 'online'
        });

        res.json({
            user: { id: user._id, name: user.name, username: user.username, role: user.role, totalPoints: user.totalPoints, badges: user.badges },
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Logout
router.post("/logout", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update user status
        user.status = 'offline';
        user.lastLogout = new Date();
        await user.save();

        // Find the latest 'online' activity log for this user and mark offline
        const latestLog = await ActivityLog.findOne({ user: user._id, status: 'online' }).sort({ loginTime: -1 });
        if (latestLog) {
            latestLog.logoutTime = new Date();
            latestLog.status = 'offline';
            await latestLog.save();
        }

        res.json({ message: "Logged out successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Update Profile (Name)
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        await user.save();

        res.json({
            user: { id: user._id, name: user.name, username: user.username, role: user.role, totalPoints: user.totalPoints, badges: user.badges }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;