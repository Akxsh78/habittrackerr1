const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Admin middleware to restrict access
const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get all users
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ name: 1 });
        res.json({ data: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
