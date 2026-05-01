const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let demoUser = JSON.parse(localStorage.getItem('mockUser')) || {
  _id: 'user1',
  name: 'Alex Johnson',
  username: 'alexj',
  email: 'demo@habitflow.app',
  theme: 'dark',
  totalPoints: 1250,
  badges: [
    { name: 'Week Warrior', description: '7-day streak!', icon: '🔥', earnedAt: new Date().toISOString() },
    { name: 'Getting Started', description: '10 completions!', icon: '⭐', earnedAt: new Date().toISOString() },
    { name: 'Halfway Hero', description: '50 completions!', icon: '🏅', earnedAt: new Date().toISOString() },
  ],
  createdAt: '2024-01-01T00:00:00Z',
};

let demoHabits = JSON.parse(localStorage.getItem('mockHabits')) || [
  {
    _id: 'h1',
    title: 'Morning Meditation',
    category: 'Mindfulness',
    color: '#a855f7',
    icon: '🧘',
    frequency: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    reminder: { enabled: true, time: '07:00' },
    target: { value: 10, unit: 'min' },
    currentStreak: 12,
    longestStreak: 14,
    totalCompletions: 45,
    isArchived: false,
    completions: [
      { date: new Date().toISOString().split('T')[0], completedAt: new Date().toISOString() },
    ],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: 'h2',
    title: 'Read 30 Pages',
    category: 'Study',
    color: '#38bdf8',
    icon: '📚',
    frequency: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    reminder: { enabled: false, time: '20:00' },
    target: { value: 30, unit: 'pages' },
    currentStreak: 5,
    longestStreak: 21,
    totalCompletions: 89,
    isArchived: false,
    completions: [],
    createdAt: '2024-01-01T00:00:00Z',
  },
];

const saveState = () => {
  localStorage.setItem('mockUser', JSON.stringify(demoUser));
  localStorage.setItem('mockHabits', JSON.stringify(demoHabits));
};

export const authAPI = {
  register: async (data) => {
    await delay(600);
    demoUser = { ...demoUser, name: data.name, username: data.username, email: data.email };
    saveState();
    return { data: { token: 'mock-jwt-token', user: demoUser } };
  },
  login: async (data) => {
    await delay(600);
    // Authenticate any input for the demo
    demoUser = { ...demoUser, email: data.email };
    saveState();
    return { data: { token: 'mock-jwt-token', user: demoUser } };
  },
  getMe: async () => {
    await delay(300);
    return { data: { user: demoUser } };
  },
  updateProfile: async (data) => {
    await delay(400);
    demoUser = { ...demoUser, ...data };
    saveState();
    return { data: demoUser };
  },
  updatePassword: async (data) => {
    await delay(400);
    return { data: { success: true } };
  },
};

export const habitsAPI = {
  getAll: async (params) => {
    await delay(400);
    let habits = demoHabits.filter((h) => !h.isArchived);
    if (params?.category) habits = habits.filter((h) => h.category === params.category);
    if (params?.search) habits = habits.filter((h) => h.title.toLowerCase().includes(params.search.toLowerCase()));
    
    // Add completedToday flag dynamically
    const today = new Date().toISOString().split('T')[0];
    habits = habits.map((h) => ({
      ...h,
      completedToday: h.completions.some((c) => c.date === today),
    }));
    return { data: { data: habits } };
  },
  getOne: async (id) => {
    await delay(200);
    const habit = demoHabits.find((h) => h._id === id);
    return { data: { data: habit } };
  },
  create: async (data) => {
    await delay(500);
    const habit = {
      _id: 'h' + Date.now(),
      ...data,
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      completions: [],
      isArchived: false,
      createdAt: new Date().toISOString(),
    };
    demoHabits.unshift(habit);
    saveState();
    return { data: { data: habit } };
  },
  update: async (id, data) => {
    await delay(400);
    const idx = demoHabits.findIndex((h) => h._id === id);
    if (idx > -1) {
      demoHabits[idx] = { ...demoHabits[idx], ...data };
      saveState();
    }
    return { data: { data: demoHabits[idx] } };
  },
  delete: async (id) => {
    await delay(300);
    demoHabits = demoHabits.filter((h) => h._id !== id);
    saveState();
    return { data: { success: true } };
  },
  toggleComplete: async (id, data) => {
    await delay(300);
    const idx = demoHabits.findIndex((h) => h._id === id);
    if (idx > -1) {
      const today = new Date().toISOString().split('T')[0];
      const habit = demoHabits[idx];
      const completedIdx = habit.completions.findIndex((c) => c.date === today);
      let completed = false;

      if (completedIdx > -1) {
        // undo completion
        habit.completions.splice(completedIdx, 1);
        habit.totalCompletions = Math.max(0, habit.totalCompletions - 1);
        habit.currentStreak = Math.max(0, habit.currentStreak - 1);
      } else {
        // complete
        habit.completions.push({ date: today, completedAt: new Date().toISOString() });
        habit.totalCompletions += 1;
        habit.currentStreak += 1;
        habit.longestStreak = Math.max(habit.longestStreak, habit.currentStreak);
        completed = true;
      }
      saveState();
      return { data: { data: habit, completed } };
    }
    throw new Error('Habit not found');
  },
  getStats: async () => {
    await delay(300);

    const todayStr = new Date().toISOString().split('T')[0];
    const activeHabits = demoHabits.filter((h) => !h.isArchived);
    const totalHabits = activeHabits.length;
    let completedToday = 0;
    
    // Calculate category stats
    const categoryStats = {};
    activeHabits.forEach((h) => {
      if (!categoryStats[h.category]) categoryStats[h.category] = { count: 0, completions: 0 };
      categoryStats[h.category].count += 1;
      categoryStats[h.category].completions += h.totalCompletions;
      
      if (h.completions.some(c => c.date === todayStr)) {
        completedToday++;
      }
    });

    // Make some dummy weekly data
    const weeklyData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: Math.floor(Math.random() * totalHabits),
      };
    });
    
    // Add real today count
    weeklyData[6].completed = completedToday;

    const statsData = {
      totalHabits,
      completedToday,
      completionRate: totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0,
      totalStreak: demoUser.badges.length * 10 || 12,
      maxStreak: 21,
      categoryStats,
      weeklyData,
      monthlyData: [], // Dummy
      heatmapData: {}, // Dummy
    };

    return { data: { data: statsData } };
  },
};

export const usersAPI = {
  getProfile: async () => {
    await delay(300);
    return { data: demoUser };
  },
  getBadges: async () => {
    await delay(300);
    return { data: { data: demoUser.badges } };
  },
};
