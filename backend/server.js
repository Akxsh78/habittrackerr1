const express = require("express");
const Habit = require("./models/Habit");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authMiddleware = require("./middleware/authMiddleware");
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ Error:", err));

// Test route
app.get("/", (req, res) => {
    res.send("Server Running 🚀");
});

// Secure all habit routes below
app.use("/api/habits", authMiddleware);

// Get stats
app.get("/api/habits/stats", async (req, res) => {
    const habits = await Habit.find({ user: req.user.id }).lean();
    const totalHabits = habits.length;
    let completedToday = 0;
    const categoryStats = {};
    const todayStr = new Date().toISOString().split('T')[0];

    habits.forEach(h => {
        const cat = h.category || 'Other';
        if (!categoryStats[cat]) {
            categoryStats[cat] = { count: 0, completions: 0 };
        }
        categoryStats[cat].count += 1;
        categoryStats[cat].completions += h.totalCompletions || 0;

        if (h.completions && h.completions.some(c => c.date === todayStr)) {
            completedToday++;
        }
    });

    const weeklyData = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        
        let dayCompleted = 0;
        habits.forEach(h => {
            if (h.completions && h.completions.some(c => c.date === dateStr)) {
                dayCompleted++;
            }
        });

        return {
            date: dateStr,
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            completed: dayCompleted,
        };
    });

    res.json({
        data: {
            totalHabits,
            completedToday,
            completionRate: totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0,
            totalStreak: 0,
            maxStreak: habits.reduce((max, h) => Math.max(max, h.longestStreak || 0), 0),
            categoryStats,
            weeklyData
        }
    });
});

// Get habits
app.get("/api/habits", async (req, res) => {
    const { category, frequency, search } = req.query;
    let query = { user: req.user.id };
    if (category) query.category = category;
    if (frequency) query.frequency = frequency;
    if (search) query.title = { $regex: search, $options: "i" };

    const habits = await Habit.find(query).lean();
    const today = new Date().toISOString().split("T")[0];
    
    const formattedHabits = habits.map(h => ({
        ...h,
        completedToday: h.completions && h.completions.some(c => c.date === today)
    }));

    res.json({ data: formattedHabits });
});

// Create habit
app.post("/api/habits", async (req, res) => {
    const newHabit = new Habit({ ...req.body, user: req.user.id });
    await newHabit.save();
    const h = newHabit.toObject();
    h.completedToday = false;
    res.json({ data: h });
});

// Delete habit
app.delete("/api/habits/:id", async (req, res) => {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!habit) return res.status(404).json({ message: "Habit not found" });
    res.json({ message: "Deleted" });
});

// Toggle habit or Update habit
app.put("/api/habits/:id", async (req, res) => {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    // If it's a toggle completion request
    if (req.body.date) {
        const today = req.body.date;
        const exists = habit.completions.find(c => c.date === today);
        if (exists) {
            habit.completions = habit.completions.filter(c => c.date !== today);
            habit.totalCompletions = Math.max(0, habit.totalCompletions - 1);
        } else {
            habit.completions.push({ date: today });
            habit.totalCompletions += 1;
        }
        
        // Simple streak logic
        habit.currentStreak = exists ? 0 : habit.currentStreak + 1;
        if (habit.currentStreak > habit.longestStreak) {
            habit.longestStreak = habit.currentStreak;
        }

        await habit.save();
        const h = habit.toObject();
        h.completedToday = !exists;
        res.json({ data: h, completed: !exists });
    } else {
        // Normal update
        Object.assign(habit, req.body);
        await habit.save();
        const h = habit.toObject();
        const todayStr = new Date().toISOString().split("T")[0];
        h.completedToday = h.completions && h.completions.some(c => c.date === todayStr);
        res.json({ data: h });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});