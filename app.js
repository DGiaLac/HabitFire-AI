/* ==========================================================================
   HabitFire JavaScript Application Logic
   Features: Stateful Checklist, Dynamic 7-day History, Streak Engine,
             Notification Simulator, LocalStorage Sync, and Time Travel Sandbox
   ========================================================================== */

// --- Streak Tier Progression Table ---
// Each tier defines: minimum streak days needed to unlock, display name, emoji icon,
// flame gradient stop-colors (bottom→top), glow color (rgba), title text color,
// card background glow, flicker animation speed multiplier, and motivational flavor.
const STREAK_TIERS = [
  {
    min: 0, max: 0,
    name: "Cold Engine",
    emoji: "🧊",
    flame: ["#0a1d37", "#0d3c61", "#105a8a", "#8ecae6"],
    glow: "rgba(142, 202, 230, 0.25)",
    glowBg: "rgba(142, 202, 230, 0.08)",
    titleColor: "#8ecae6",
    flickerSpeed: "none",
    badgeGradient: "linear-gradient(135deg, rgba(10, 29, 55, 0.2), rgba(142, 202, 230, 0.2))",
    badgeBorder: "rgba(142, 202, 230, 0.35)",
    badgeColor: "#8ecae6",
    title: "Cold Engine",
    desc: "Engine is completely cold. Complete today's checklist to ignite the spark!"
  },
  {
    min: 1, max: 6,
    name: "Idle Spark",
    emoji: "🔌",
    flame: ["#0d3c61", "#105a8a", "#3a86c8", "#a2d2ff"],
    glow: "rgba(162, 210, 255, 0.3)",
    glowBg: "rgba(162, 210, 255, 0.12)",
    titleColor: "#a2d2ff",
    flickerSpeed: "slow",
    badgeGradient: "linear-gradient(135deg, rgba(13, 60, 97, 0.2), rgba(162, 210, 255, 0.2))",
    badgeBorder: "rgba(162, 210, 255, 0.4)",
    badgeColor: "#a2d2ff",
    title: "Idle Spark ⚡",
    desc: "Engine starting up! ${streak} day(s) active. Let the pistons pump momentum!"
  },
  {
    min: 7, max: 13,
    name: "Cool Cruise",
    emoji: "🚙",
    flame: ["#105a8a", "#0077b6", "#0096c7", "#90e0ef"],
    glow: "rgba(0, 150, 199, 0.35)",
    glowBg: "rgba(0, 150, 199, 0.14)",
    titleColor: "#90e0ef",
    flickerSpeed: "normal",
    badgeGradient: "linear-gradient(135deg, rgba(16, 90, 138, 0.2), rgba(0, 180, 216, 0.2))",
    badgeBorder: "rgba(0, 180, 216, 0.45)",
    badgeColor: "#90e0ef",
    title: "Cool Cruise 🚙",
    desc: "7+ days strong! Cruising elegantly on the open highway. Keep the RPM stable."
  },
  {
    min: 14, max: 29,
    name: "Boost Engaged",
    emoji: "🚀",
    flame: ["#03045e", "#0077b6", "#00b4d8", "#caf0f8"],
    glow: "rgba(0, 180, 216, 0.45)",
    glowBg: "rgba(0, 180, 216, 0.18)",
    titleColor: "#00b4d8",
    flickerSpeed: "normal",
    badgeGradient: "linear-gradient(135deg, rgba(3, 4, 94, 0.25), rgba(0, 180, 216, 0.25))",
    badgeBorder: "rgba(0, 180, 216, 0.5)",
    badgeColor: "#00b4d8",
    title: "Boost Engaged! 🚀",
    desc: "${streak} days! Turbo boost is fully engaged. Accelerating beautifully into massive consistency!"
  },
  {
    min: 30, max: 44,
    name: "Nitrous Oxide",
    emoji: "🧪",
    flame: ["#005f73", "#0a9396", "#94d2bd", "#e9d8a6"],
    glow: "rgba(10, 147, 150, 0.55)",
    glowBg: "rgba(10, 147, 150, 0.22)",
    titleColor: "#0a9396",
    flickerSpeed: "fast",
    badgeGradient: "linear-gradient(135deg, rgba(0, 95, 115, 0.3), rgba(10, 147, 150, 0.3))",
    badgeBorder: "rgba(10, 147, 150, 0.55)",
    badgeColor: "#0a9396",
    title: "Nitrous Oxide! 🧪",
    desc: "${streak} days! A full month of nitrous injection. Burning absolute cyber-cyan flame!"
  },
  {
    min: 45, max: 59,
    name: "High Octane",
    emoji: "🏎️",
    flame: ["#003f5c", "#2f5c8f", "#5880b5", "#a1c4fd"],
    glow: "rgba(88, 128, 181, 0.6)",
    glowBg: "rgba(88, 128, 181, 0.25)",
    titleColor: "#a1c4fd",
    flickerSpeed: "fast",
    badgeGradient: "linear-gradient(135deg, rgba(0, 63, 92, 0.3), rgba(88, 128, 181, 0.3))",
    badgeBorder: "rgba(88, 128, 181, 0.6)",
    badgeColor: "#a1c4fd",
    title: "High Octane 🏁",
    desc: "${streak} days! Premium high-octane performance fuel. Your cylinders are pumping perfectly!"
  },
  {
    min: 60, max: 89,
    name: "Supercharged",
    emoji: "🌀",
    flame: ["#1d3557", "#457b9d", "#a8dadc", "#f1faee"],
    glow: "rgba(69, 123, 157, 0.65)",
    glowBg: "rgba(69, 123, 157, 0.28)",
    titleColor: "#a8dadc",
    flickerSpeed: "fast",
    badgeGradient: "linear-gradient(135deg, rgba(29, 53, 87, 0.3), rgba(69, 123, 157, 0.3))",
    badgeBorder: "rgba(69, 123, 157, 0.65)",
    badgeColor: "#a8dadc",
    title: "Supercharged V8! 🌀",
    desc: "${streak} days! Over two months supercharged. Massive horsepower generated daily!"
  },
  {
    min: 90, max: 119,
    name: "Turbocharged",
    emoji: "🌪️",
    flame: ["#0b2545", "#134074", "#8da9c4", "#eef4f8"],
    glow: "rgba(19, 64, 116, 0.7)",
    glowBg: "rgba(19, 64, 116, 0.3)",
    titleColor: "#8da9c4",
    flickerSpeed: "ultra",
    badgeGradient: "linear-gradient(135deg, rgba(11, 37, 69, 0.35), rgba(19, 64, 116, 0.35))",
    badgeBorder: "rgba(19, 64, 116, 0.7)",
    badgeColor: "#8da9c4",
    title: "Turbocharged Titan! 🌪️",
    desc: "${streak} days! Twin-turbo custom setup. You have transcended the speed limits!"
  },
  {
    min: 120, max: 179,
    name: "Cosmic Speed",
    emoji: "🌠",
    flame: ["#0f172a", "#1e293b", "#06b6d4", "#e0f7ff"],
    glow: "rgba(6, 182, 212, 0.75)",
    glowBg: "rgba(6, 182, 212, 0.3)",
    titleColor: "#06b6d4",
    flickerSpeed: "ultra",
    badgeGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.4), rgba(6, 182, 212, 0.4))",
    badgeBorder: "rgba(6, 182, 212, 0.75)",
    badgeColor: "#06b6d4",
    title: "Cosmic Velocity! 🌠",
    desc: "${streak} days! Shifting through stellar dimensions at lightspeed. Elegant mastery!"
  },
  {
    min: 180, max: 239,
    name: "Hyperdrive",
    emoji: "🌌",
    flame: ["#172554", "#1d4ed8", "#38bdf8", "#f0f9ff"],
    glow: "rgba(56, 189, 248, 0.75)",
    glowBg: "rgba(56, 189, 248, 0.28)",
    titleColor: "#38bdf8",
    flickerSpeed: "ultra",
    badgeGradient: "linear-gradient(135deg, rgba(23, 37, 84, 0.4), rgba(56, 189, 248, 0.4))",
    badgeBorder: "rgba(56, 189, 248, 0.75)",
    badgeColor: "#38bdf8",
    title: "Hyperdrive Engaged! 🌌",
    desc: "${streak} days! Half a year in hyperdrive speed lines. You've entered a new galaxy of consistency!"
  },
  {
    min: 240, max: 364,
    name: "Velocity Master",
    emoji: "🏎️",
    flame: ["#020617", "#0f172a", "#67e8f9", "#ffffff"],
    glow: "rgba(103, 232, 249, 0.8)",
    glowBg: "rgba(103, 232, 249, 0.32)",
    titleColor: "#67e8f9",
    flickerSpeed: "ultra",
    badgeGradient: "linear-gradient(135deg, rgba(2, 6, 23, 0.45), rgba(103, 232, 249, 0.45))",
    badgeBorder: "rgba(103, 232, 249, 0.8)",
    badgeColor: "#67e8f9",
    title: "Velocity Master 🏎️",
    desc: "${streak} days! Precision-handling your daily habits like a world-class racing legend!"
  },
  {
    min: 365, max: Infinity,
    name: "Eternal Combustion",
    emoji: "♾️",
    flame: ["#030712", "#00b4d8", "#90e0ef", "#ffffff"],
    glow: "rgba(144, 224, 239, 0.9)",
    glowBg: "rgba(144, 224, 239, 0.35)",
    titleColor: "#90e0ef",
    flickerSpeed: "ultra",
    badgeGradient: "linear-gradient(135deg, rgba(3, 7, 18, 0.5), rgba(144, 224, 239, 0.5))",
    badgeBorder: "rgba(144, 224, 239, 0.9)",
    badgeColor: "#90e0ef",
    title: "♾️ Eternal Combustion",
    desc: "${streak} days! A FULL YEAR of high-octane speed. You are the legendary Eternal Combustion!"
  }
];

/** Returns the matching tier object for a given streak count */
function getStreakTier(streak) {
  for (let i = STREAK_TIERS.length - 1; i >= 0; i--) {
    if (streak >= STREAK_TIERS[i].min) return STREAK_TIERS[i];
  }
  return STREAK_TIERS[0];
}

// --- Default Motivational Quotes ---
const MOTIVATIONAL_QUOTES = [
  { text: "Consistency is the bridge between goals and accomplishments.", author: "Jim Rohn" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "It is easier to prevent bad habits than to break them.", author: "Benjamin Franklin" },
  { text: "Your habits will determine your future.", author: "Jack Canfield" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" }
];

// --- Core Application State Management ---
class HabitFireApp {
  constructor() {
    this.state = {
      tasks: {},             // Map: "YYYY-MM-DD" -> Array of tasks [{ id, text, completed, createdAt }]
      settings: {
        userName: "Achiever",
        reminderEnabled: true,
        reminderTime: "08:30", // HH:MM
        googleUser: null       // Saved Google Account profile information
      },
      stats: {
        currentStreak: 0,
        longestStreak: 0
      },
      timeTravelOffsetDays: 0, // In-memory offset for sandbox testing
      lastNotificationSentDate: null // Prevents duplicate notifications on same simulated day
    };

    // UI state
    this.activeScreen = "screen-today";
    this.historySelectedDateStr = ""; // Selected date string in History view
    this.notificationPermissionGranted = false;
    this.simulatedNotifications = [];

    // Bind DOM events and initialize
    this.init();
  }

  // --- Initialize App ---
  init() {
    this.loadStateFromStorage();
    this.registerNotificationPermissions();
    this.cacheDOM();
    this.bindEvents();
    this.startMockClock();
    this.startNotificationDaemon();
    
    // Google Auth Session Initializer
    this.sessionGuestMode = false;
    this.checkGoogleAuthStatus();

    // Initial Render
    this.historySelectedDateStr = this.getTodayDateString();
    this.renderAll();
  }

  // --- Load / Save Local Storage ---
  loadStateFromStorage() {
    const stored = localStorage.getItem("habitfire_state");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.tasks) this.state.tasks = parsed.tasks;
        if (parsed.settings) this.state.settings = { ...this.state.settings, ...parsed.settings };
        if (parsed.stats) this.state.stats = { ...this.state.stats, ...parsed.stats };
        if (parsed.lastNotificationSentDate) this.state.lastNotificationSentDate = parsed.lastNotificationSentDate;
      } catch (e) {
        console.error("Failed to parse LocalStorage state, resetting to defaults", e);
      }
    }
  }

  saveStateToStorage() {
    const dataToSave = {
      tasks: this.state.tasks,
      settings: this.state.settings,
      stats: this.state.stats,
      lastNotificationSentDate: this.state.lastNotificationSentDate
    };
    localStorage.setItem("habitfire_state", JSON.stringify(dataToSave));
  }

  // --- Browser Native Notifications ---
  async registerNotificationPermissions() {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        this.notificationPermissionGranted = true;
      } else if (Notification.permission !== "denied") {
        try {
          const permission = await Notification.requestPermission();
          this.notificationPermissionGranted = (permission === "granted");
        } catch (e) {
          console.warn("Could not request notification permissions:", e);
        }
      }
    }
  }

  // --- DOM Element Caching ---
  cacheDOM() {
    // Navigation
    this.navItems = document.querySelectorAll(".bottom-nav .nav-item");
    this.screens = document.querySelectorAll(".app-screen");

    // Header & Global
    this.headerStreakValue = document.getElementById("headerStreakValue");
    this.statusTime = document.getElementById("statusTime");
    this.statusBar = document.getElementById("statusBar");
    this.statusNotificationIcons = document.getElementById("statusNotificationIcons");
    
    // Notification Drawer
    this.notificationDrawer = document.getElementById("notificationDrawer");
    this.notificationDrawerHandle = document.getElementById("notificationDrawerHandle");
    this.drawerNotificationsContainer = document.getElementById("drawerNotificationsContainer");
    this.emptyDrawerMsg = document.getElementById("emptyDrawerMsg");
    this.clearNotificationsBtn = document.getElementById("clearNotificationsBtn");

    // Today Screen
    this.todayTitle = document.getElementById("todayTitle");
    this.todaySubtitle = document.getElementById("todaySubtitle");
    this.todayProgressRing = document.getElementById("todayProgressRing");
    this.todayPercentText = document.getElementById("todayPercentText");
    this.todayProgressFraction = document.getElementById("todayProgressFraction");
    this.todayProgressLabel = document.getElementById("todayProgressLabel");
    this.todayTaskList = document.getElementById("todayTaskList");
    this.todayEmptyState = document.getElementById("todayEmptyState");
    this.todayCountBadge = document.getElementById("todayCountBadge");
    this.addTaskForm = document.getElementById("addTaskForm");
    this.taskInput = document.getElementById("taskInput");

    // History Screen
    this.historyWeekBar = document.getElementById("historyWeekBar");
    this.historySelectedDayTitle = document.getElementById("historySelectedDayTitle");
    this.historySelectedPill = document.getElementById("historySelectedPill");
    this.historyTaskList = document.getElementById("historyTaskList");
    this.historyEmptyState = document.getElementById("historyEmptyState");
    this.historyEmptyStateTitle = document.getElementById("historyEmptyStateTitle");
    this.historyEmptyStateText = document.getElementById("historyEmptyStateText");

    // Stats Screen
    this.statsStreakNumber = document.getElementById("statsStreakNumber");
    this.streakStatusTitle = document.getElementById("streakStatusTitle");
    this.streakStatusDesc = document.getElementById("streakStatusDesc");
    this.statsLongestStreak = document.getElementById("statsLongestStreak");
    this.statsTotalCompleted = document.getElementById("statsTotalCompleted");
    this.statsTotalCreated = document.getElementById("statsTotalCreated");
    this.statsConsistency = document.getElementById("statsConsistency");
    this.motivationalQuote = document.getElementById("motivationalQuote");
    this.motivationalAuthor = document.getElementById("motivationalAuthor");
    this.streakFlameContainer = document.getElementById("streakFlameContainer");

    // Settings Screen
    this.settingsUserName = document.getElementById("settingsUserName");
    this.settingsReminderEnabled = document.getElementById("settingsReminderEnabled");
    this.settingsReminderTime = document.getElementById("settingsReminderTime");
    this.btnTestNotification = document.getElementById("btnTestNotification");
    this.btnTimeTravel = document.getElementById("btnTimeTravel");
    this.btnResetData = document.getElementById("btnResetData");
    this.btnExportData = document.getElementById("btnExportData");
    this.btnImportData = document.getElementById("btnImportData");
    this.importFileSelector = document.getElementById("importFileSelector");

    // Google Authentication DOM elements
    this.welcomeModal = document.getElementById("welcomeModal");
    this.btnWelcomeGoogleLogin = document.getElementById("btnWelcomeGoogleLogin");
    this.btnWelcomeGuest = document.getElementById("btnWelcomeGuest");
    this.googlePopupModal = document.getElementById("googlePopupModal");
    this.googleAccountsList = document.getElementById("googleAccountsList");
    this.googleCustomAccountForm = document.getElementById("googleCustomAccountForm");
    this.googleCustomName = document.getElementById("googleCustomName");
    this.googleCustomEmail = document.getElementById("googleCustomEmail");
    this.btnCustomCancel = document.getElementById("btnCustomCancel");
    this.btnCustomSubmit = document.getElementById("btnCustomSubmit");
    this.settingsGoogleGroup = document.getElementById("settingsGoogleGroup");
    this.settingsSignedOutView = document.getElementById("settingsSignedOutView");
    this.settingsSignedInView = document.getElementById("settingsSignedInView");
    this.btnSettingsGoogleLogin = document.getElementById("btnSettingsGoogleLogin");
    this.settingsProfilePic = document.getElementById("settingsProfilePic");
    this.settingsProfileName = document.getElementById("settingsProfileName");
    this.settingsProfileEmail = document.getElementById("settingsProfileEmail");
    this.btnGoogleSignOut = document.getElementById("btnGoogleSignOut");
    this.headerProfileAvatar = document.getElementById("headerProfileAvatar");
    this.headerProfilePic = document.getElementById("headerProfilePic");
    this.headerBrandEmoji = document.getElementById("headerBrandEmoji");
  }

  // --- Bind UI Event Handlers ---
  bindEvents() {
    // Bottom Tab navigation
    this.navItems.forEach(item => {
      item.addEventListener("click", () => {
        const targetScreen = item.getAttribute("data-screen");
        this.switchScreen(targetScreen);
      });
    });

    // Today task submission
    this.addTaskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addNewTask();
    });

    // Notification Drawer interaction
    this.statusBar.addEventListener("click", () => this.toggleNotificationDrawer(true));
    this.notificationDrawerHandle.addEventListener("click", () => this.toggleNotificationDrawer(false));
    this.clearNotificationsBtn.addEventListener("click", () => this.clearAllSimulatedNotifications());

    // Settings Profile update
    this.settingsUserName.addEventListener("input", (e) => {
      this.state.settings.userName = e.target.value.trim() || "Achiever";
      this.saveStateToStorage();
      this.renderTodayGreeting();
    });

    // Settings Reminder Toggles
    this.settingsReminderEnabled.addEventListener("change", (e) => {
      this.state.settings.reminderEnabled = e.target.checked;
      this.saveStateToStorage();
    });

    this.settingsReminderTime.addEventListener("change", (e) => {
      this.state.settings.reminderTime = e.target.value;
      this.saveStateToStorage();
    });

    // Settings testing buttons
    this.btnTestNotification.addEventListener("click", () => {
      this.triggerReminderNotification(true); // Forced instant simulated notification
    });

    this.btnTimeTravel.addEventListener("click", () => {
      this.simulateTimeTravel(1); // Jump 1 day forward
    });

    this.btnResetData.addEventListener("click", () => {
      if (confirm("Are you absolutely sure you want to delete all HabitFire data? This includes your current streaks, task history, and customized times.")) {
        this.resetAllData();
      }
    });

    this.btnExportData.addEventListener("click", () => this.exportStateData());
    this.btnImportData.addEventListener("click", () => this.importFileSelector.click());
    this.importFileSelector.addEventListener("change", (e) => this.handleImportFile(e));

    // Google Sign-In Event Bindings
    this.btnWelcomeGoogleLogin.addEventListener("click", () => this.openGoogleSignInSelector());
    this.btnWelcomeGuest.addEventListener("click", () => this.continueAsGuest());
    this.btnSettingsGoogleLogin.addEventListener("click", () => this.openGoogleSignInSelector());
    this.btnGoogleSignOut.addEventListener("click", () => this.signOutGoogle());
    this.btnCustomCancel.addEventListener("click", () => this.closeCustomAccountForm());
    this.btnCustomSubmit.addEventListener("click", () => this.submitCustomAccount());

    // Keyboard dismissal on mobile inputs
    this.taskInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.taskInput.blur();
      }
    });
  }

  // --- Tab Screen Navigation ---
  switchScreen(screenId) {
    this.activeScreen = screenId;
    
    // Toggle active screen classes
    this.screens.forEach(screen => {
      if (screen.id === screenId) {
        screen.classList.add("active");
      } else {
        screen.classList.remove("active");
      }
    });

    // Toggle active navigation items
    this.navItems.forEach(item => {
      if (item.getAttribute("data-screen") === screenId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Screen-specific updates
    if (screenId === "screen-history") {
      this.renderHistoryWeekCalendar();
      this.renderHistoryChecklist();
    } else if (screenId === "screen-analytics") {
      this.updateStreakEngine();
      this.renderAnalyticsDashboard();
    } else if (screenId === "screen-settings") {
      this.populateSettingsForm();
    } else if (screenId === "screen-today") {
      this.renderTodayScreen();
    }
  }

  // --- Date Sandbox Time travel logic ---
  getSimulatedTime() {
    const systemTime = new Date();
    // Add time travel offset in milliseconds
    const offsetMs = this.state.timeTravelOffsetDays * 24 * 60 * 60 * 1000;
    return new Date(systemTime.getTime() + offsetMs);
  }

  getTodayDateString() {
    const d = this.getSimulatedTime();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getDateStringFromOffset(offsetFromToday) {
    const d = this.getSimulatedTime();
    d.setDate(d.getDate() + offsetFromToday);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // --- Android Clock Sync ---
  startMockClock() {
    const updateTime = () => {
      const time = this.getSimulatedTime();
      let hours = time.getHours();
      const minutes = String(time.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      this.statusTime.textContent = `${hours}:${minutes} ${ampm}`;
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  // --- Alarm System for Morning reminders ---
  startNotificationDaemon() {
    setInterval(() => {
      if (!this.state.settings.reminderEnabled) return;
      
      const now = this.getSimulatedTime();
      const currentHour = String(now.getHours()).padStart(2, '0');
      const currentMinute = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMinute}`;
      
      const todayStr = this.getTodayDateString();

      // Check if reminder matches set time AND hasn't been fired on this simulated day yet
      if (currentTimeStr === this.state.settings.reminderTime && this.state.lastNotificationSentDate !== todayStr) {
        this.state.lastNotificationSentDate = todayStr;
        this.saveStateToStorage();
        this.triggerReminderNotification(false);
      }
    }, 10000); // Scan every 10 seconds
  }

  // --- Trigger Alerts (Native + Mock Android Overlay) ---
  triggerReminderNotification(forced = false) {
    const title = `Good Morning, ${this.state.settings.userName}! ☀️`;
    const message = "Time to fuel your streak! Grab your coffee and create your to-do checklist for today.";

    // 1. Trigger Native Web Notification if permitted
    if (this.notificationPermissionGranted) {
      try {
        new Notification(title, {
          body: message,
          icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>🔥</text></svg>"
        });
      } catch (e) {
        console.warn("Failed to fire native notification, falling back to simulated UI drawer:", e);
      }
    }

    // 2. Add into Simulated Notification Drawer
    const newNotif = {
      id: Date.now(),
      title: title,
      message: message,
      time: this.statusTime.textContent,
      type: "reminder"
    };

    this.simulatedNotifications.unshift(newNotif);
    this.renderNotificationDrawer();
    
    // Add pulse indicator on Android Status bar
    this.updateStatusBarNotificationIndicator(true);

    // Slide down notification drawer automatically to grab user's attention
    this.toggleNotificationDrawer(true);

    // Audio-like haptic alert (simulated using light browser beep sound if desired)
    this.playMockSound();
  }

  updateStatusBarNotificationIndicator(visible) {
    if (visible && this.simulatedNotifications.length > 0) {
      this.statusNotificationIcons.innerHTML = `
        <span class="status-notification-icon" title="New Morning Reminder">🔔</span>
      `;
    } else {
      this.statusNotificationIcons.innerHTML = "";
    }
  }

  toggleNotificationDrawer(isOpen) {
    if (isOpen) {
      this.notificationDrawer.classList.add("open");
    } else {
      this.notificationDrawer.classList.remove("open");
    }
  }

  clearAllSimulatedNotifications() {
    this.simulatedNotifications = [];
    this.renderNotificationDrawer();
    this.updateStatusBarNotificationIndicator(false);
    this.toggleNotificationDrawer(false);
  }

  renderNotificationDrawer() {
    if (this.simulatedNotifications.length === 0) {
      this.emptyDrawerMsg.style.display = "block";
      this.clearNotificationsBtn.style.display = "none";
      // Remove all elements except empty msg
      const cards = this.drawerNotificationsContainer.querySelectorAll(".notification-card");
      cards.forEach(card => card.remove());
      return;
    }

    this.emptyDrawerMsg.style.display = "none";
    this.clearNotificationsBtn.style.display = "block";

    // Rebuild drawer notifications list safely
    const cards = this.drawerNotificationsContainer.querySelectorAll(".notification-card");
    cards.forEach(card => card.remove());

    this.simulatedNotifications.forEach(notif => {
      const card = document.createElement("div");
      card.className = "notification-card";
      card.innerHTML = `
        <div class="notification-card-header">
          <span>SYSTEM SYSTEM</span>
          <span>${notif.time}</span>
        </div>
        <div class="notification-card-title">${notif.title}</div>
        <div class="notification-card-desc">${notif.message}</div>
      `;
      this.drawerNotificationsContainer.appendChild(card);
    });
  }

  playMockSound() {
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.connect(gain);
      gain.connect(context.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, context.currentTime); // D5 note
      gain.gain.setValueAtTime(0.08, context.currentTime);
      osc.start();
      osc.stop(context.currentTime + 0.12);
      
      setTimeout(() => {
        const osc2 = context.createOscillator();
        osc2.connect(gain);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(880, context.currentTime); // A5 note
        osc2.start();
        osc2.stop(context.currentTime + 0.2);
      }, 130);
    } catch (e) {
      // Audio context might be blocked prior to interaction, ignore
    }
  }

  // --- Task CRUD Logic ---
  addNewTask() {
    const text = this.taskInput.value.trim();
    if (!text) return;

    const todayStr = this.getTodayDateString();
    
    // Create day array if missing
    if (!this.state.tasks[todayStr]) {
      this.state.tasks[todayStr] = [];
    }

    const newTask = {
      id: "task_" + Math.random().toString(36).substr(2, 9),
      text: text,
      completed: false,
      createdAt: Date.now()
    };

    this.state.tasks[todayStr].push(newTask);
    this.taskInput.value = "";
    
    this.saveStateToStorage();
    this.updateStreakEngine();
    this.renderAll();

    // Small scale pop on form for premium micro-feedback
    this.addTaskForm.style.transform = "scale(0.97)";
    setTimeout(() => this.addTaskForm.style.transform = "none", 100);
  }

  toggleTaskCompleted(dateStr, taskId) {
    const dayTasks = this.state.tasks[dateStr];
    if (!dayTasks) return;

    const task = dayTasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;

    // Soft audio haptic on check
    if (task.completed) {
      this.playCheckoffHaptic();
    }

    this.saveStateToStorage();
    this.updateStreakEngine();
    this.renderAll();
  }

  deleteTask(dateStr, taskId) {
    const dayTasks = this.state.tasks[dateStr];
    if (!dayTasks) return;

    this.state.tasks[dateStr] = dayTasks.filter(t => t.id !== taskId);
    
    // Clean up empty days
    if (this.state.tasks[dateStr].length === 0) {
      delete this.state.tasks[dateStr];
    }

    this.saveStateToStorage();
    this.updateStreakEngine();
    this.renderAll();
  }

  playCheckoffHaptic() {
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.connect(gain);
      gain.connect(context.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, context.currentTime); // E5
      gain.gain.setValueAtTime(0.04, context.currentTime);
      osc.start();
      osc.stop(context.currentTime + 0.08);
    } catch (e) {}
  }

  // --- Streak Calculation Engine ---
  updateStreakEngine() {
    const todayStr = this.getTodayDateString();
    
    // Helper to evaluate success on any past day
    const isDaySuccessful = (dateStr) => {
      const dayTasks = this.state.tasks[dateStr] || [];
      return dayTasks.length > 0 && dayTasks.every(t => t.completed);
    };

    let streak = 0;
    let checkedDateOffset = -1; // Start looking backwards from yesterday
    let consecutiveSuccessfulDays = true;

    // 1. Walk backward starting from yesterday to determine baseline streak
    while (consecutiveSuccessfulDays) {
      const dateStr = this.getDateStringFromOffset(checkedDateOffset);
      
      // If we encounter a day that is successful, increment. Otherwise, stop.
      if (isDaySuccessful(dateStr)) {
        streak++;
        checkedDateOffset--;
      } else {
        consecutiveSuccessfulDays = false;
      }
    }

    // 2. Incorporate today's dynamic state
    const todayTasks = this.state.tasks[todayStr] || [];
    const todayCompleted = todayTasks.length > 0 && todayTasks.every(t => t.completed);

    if (todayCompleted) {
      // Today is fully successful, so it adds to yesterday's baseline streak
      streak += 1;
    } else {
      // Today is incomplete/empty.
      // Behavior: Streak is preserved if yesterday was successful (meaning today is just "in progress")
      // However, if yesterday was missed, the streak is completely dead.
      const yesterdayStr = this.getDateStringFromOffset(-1);
      const yesterdaySuccessful = isDaySuccessful(yesterdayStr);
      
      if (!yesterdaySuccessful) {
        // Yesterday was missed, streak resets to 0 (regardless of today's in-progress state)
        streak = 0;
      }
    }

    // 3. Update records
    this.state.stats.currentStreak = streak;
    if (streak > this.state.stats.longestStreak) {
      this.state.stats.longestStreak = streak;
    }

    this.saveStateToStorage();
  }

  // --- Render All Pipelines ---
  renderAll() {
    this.renderGoogleProfileUI();
    this.renderHeaderStreak();
    
    if (this.activeScreen === "screen-today") {
      this.renderTodayScreen();
    } else if (this.activeScreen === "screen-history") {
      this.renderHistoryWeekCalendar();
      this.renderHistoryChecklist();
    } else if (this.activeScreen === "screen-analytics") {
      this.renderAnalyticsDashboard();
    } else if (this.activeScreen === "screen-settings") {
      this.populateSettingsForm();
    }
  }

  renderHeaderStreak() {
    const streak = this.state.stats.currentStreak;
    const tier = getStreakTier(streak);
    const badge = this.headerStreakValue.parentElement;

    this.headerStreakValue.textContent = streak;

    // Update header badge emoji icon (replace SVG icon text)
    const svgEl = badge.querySelector(".streak-icon-mini");
    if (!badge.querySelector(".streak-emoji-mini")) {
      const emojiSpan = document.createElement("span");
      emojiSpan.className = "streak-emoji-mini";
      emojiSpan.style.cssText = "font-size:15px; line-height:1;";
      badge.insertBefore(emojiSpan, badge.firstChild);
      if (svgEl) svgEl.style.display = "none";
    }
    badge.querySelector(".streak-emoji-mini").textContent = tier.emoji;

    // Apply tier-specific badge style
    badge.style.background = tier.badgeGradient;
    badge.style.borderColor = tier.badgeBorder;
    badge.style.color = tier.badgeColor;
    badge.style.boxShadow = `0 0 12px ${tier.glow}`;

    // Only pulse when streak is active
    badge.style.animation = streak > 0 ? "firePulse 1.5s infinite alternate" : "none";
  }

  // --- Today Screen Rendering ---
  renderTodayScreen() {
    const todayStr = this.getTodayDateString();
    
    // Render dynamic date title
    const d = this.getSimulatedTime();
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    this.todayTitle.textContent = d.toLocaleDateString('en-US', options);

    // Fetch and render today's tasks
    const tasks = this.state.tasks[todayStr] || [];
    this.todayCountBadge.textContent = tasks.length;
    this.todayTaskList.innerHTML = "";

    this.renderTodayGreeting();

    if (tasks.length === 0) {
      this.todayEmptyState.style.display = "flex";
      this.updateProgressRing(0, 0);
    } else {
      this.todayEmptyState.style.display = "none";
      
      let completedCount = 0;
      // Sort: incomplete tasks first, completed at bottom
      const sortedTasks = [...tasks].sort((a, b) => a.completed - b.completed || a.createdAt - b.createdAt);

      sortedTasks.forEach(task => {
        if (task.completed) completedCount++;

        const taskCard = document.createElement("div");
        taskCard.className = `task-card ${task.completed ? 'completed' : ''}`;
        taskCard.innerHTML = `
          <div class="task-card-left">
            <button class="checkbox-btn" aria-label="Complete Task">
              <svg class="checkbox-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </button>
            <span class="task-text">${this.escapeHTML(task.text)}</span>
          </div>
          <button class="btn-delete-task" aria-label="Delete Task">
            <svg class="btn-delete-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        `;

        // Checkbox Click event
        taskCard.querySelector(".checkbox-btn").addEventListener("click", () => {
          this.toggleTaskCompleted(todayStr, task.id);
        });

        // Delete Click event
        taskCard.querySelector(".btn-delete-task").addEventListener("click", () => {
          this.deleteTask(todayStr, task.id);
        });

        this.todayTaskList.appendChild(taskCard);
      });

      this.updateProgressRing(completedCount, tasks.length);
    }
  }

  renderTodayGreeting() {
    const tasks = this.state.tasks[this.getTodayDateString()] || [];
    const allDone = tasks.length > 0 && tasks.every(t => t.completed);
    
    if (tasks.length === 0) {
      this.todaySubtitle.textContent = `Hello, ${this.state.settings.userName}! Plan your list to light the flame.`;
    } else if (allDone) {
      this.todaySubtitle.textContent = `Magnificent job, ${this.state.settings.userName}! Streak fully active for today!`;
    } else {
      const left = tasks.filter(t => !t.completed).length;
      this.todaySubtitle.textContent = `${left} task${left > 1 ? 's' : ''} left for today. Keep pushing, ${this.state.settings.userName}!`;
    }
  }

  updateProgressRing(completed, total) {
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Update text indicators
    this.todayPercentText.textContent = `${percent}%`;
    this.todayProgressFraction.textContent = `${completed} / ${total} Done`;

    // Calculate ring offset
    const radius = 28;
    const circumference = 2 * Math.PI * radius; // 175.93
    const offset = circumference - (percent / 100) * circumference;
    this.todayProgressRing.style.strokeDashoffset = offset;

    // Set motivational progress label
    if (total === 0) {
      this.todayProgressLabel.textContent = "Your checklist is empty";
    } else if (percent === 100) {
      this.todayProgressLabel.textContent = "All daily goals smashed! 🔥";
    } else if (percent >= 75) {
      this.todayProgressLabel.textContent = "Almost there! Finish strong!";
    } else if (percent >= 40) {
      this.todayProgressLabel.textContent = "Making good progress!";
    } else {
      this.todayProgressLabel.textContent = "Taking the first steps!";
    }

    // Update horizontal Speed Track & Car Position
    const speedTrackFill = document.getElementById("speedTrackFill");
    const speedTrackCar = document.getElementById("speedTrackCar");
    const speedometerLabel = document.getElementById("speedometerLabel");

    if (speedTrackFill && speedTrackCar) {
      speedTrackFill.style.width = `${percent}%`;
      speedTrackCar.style.left = `${percent}%`;
      
      // Update automotive speed label
      if (total === 0) {
        speedometerLabel.textContent = "PARKED";
      } else if (percent === 100) {
        speedometerLabel.textContent = "LIMITLESS (240 km/h) 🏁";
      } else {
        const speed = Math.round(percent * 2.4);
        speedometerLabel.textContent = `CRUISING (${speed} km/h)`;
      }
    }
  }

  // --- History Screen Rendering ---
  renderHistoryWeekCalendar() {
    this.historyWeekBar.innerHTML = "";
    
    // Reconstruct calendar for last 7 days (index -6 up to 0 [today])
    for (let i = -6; i <= 0; i++) {
      const dateStr = this.getDateStringFromOffset(i);
      const d = this.getSimulatedTime();
      d.setDate(d.getDate() + i);

      const dayInitial = d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
      const dayNum = d.getDate();
      
      const isToday = (i === 0);
      const isSelected = (dateStr === this.historySelectedDateStr);

      const dayBtn = document.createElement("button");
      dayBtn.className = `calendar-day-btn ${isSelected ? 'selected' : ''}`;
      
      // Determine daily completion status to render status dots
      const dayTasks = this.state.tasks[dateStr] || [];
      let statusClass = "none";

      if (dayTasks.length > 0) {
        const completedAll = dayTasks.every(t => t.completed);
        if (completedAll) {
          statusClass = "success"; // Green check
        } else {
          statusClass = "miss";    // Red X
        }
      } else {
        // No tasks. If it's a past day, it counts as an incomplete miss for consistency
        if (i < 0) {
          statusClass = "miss";
        }
      }

      dayBtn.innerHTML = `
        <span class="day-name">${isToday ? 'TOD' : dayInitial}</span>
        <span class="day-number">${dayNum}</span>
        <div class="day-status-indicator ${statusClass}"></div>
      `;

      dayBtn.addEventListener("click", () => {
        this.historySelectedDateStr = dateStr;
        this.renderHistoryWeekCalendar();
        this.renderHistoryChecklist();
      });

      this.historyWeekBar.appendChild(dayBtn);
    }
  }

  renderHistoryChecklist() {
    const selectedDateStr = this.historySelectedDateStr;
    const tasks = this.state.tasks[selectedDateStr] || [];

    // Calculate dynamic header title
    const d = this.getSimulatedTime();
    const todayStr = this.getTodayDateString();
    const yesterdayStr = this.getDateStringFromOffset(-1);
    
    if (selectedDateStr === todayStr) {
      this.historySelectedDayTitle.textContent = "Today";
    } else if (selectedDateStr === yesterdayStr) {
      this.historySelectedDayTitle.textContent = "Yesterday";
    } else {
      // Format as Month Date
      const parts = selectedDateStr.split('-');
      const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
      this.historySelectedDayTitle.textContent = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }

    // Render completion pill
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    this.historySelectedPill.className = "completion-pill";
    if (total === 0) {
      this.historySelectedPill.textContent = "No Checklist";
      this.historySelectedPill.classList.add("miss");
    } else {
      this.historySelectedPill.textContent = `${percent}% Done`;
      if (percent === 100) {
        this.historySelectedPill.classList.add("success");
      } else {
        this.historySelectedPill.classList.add("miss");
      }
    }

    this.historyTaskList.innerHTML = "";

    if (total === 0) {
      this.historyEmptyState.style.display = "flex";
      
      // Update details for empty states based on date selection
      if (selectedDateStr === todayStr) {
        this.historyEmptyStateTitle.textContent = "No tasks created yet";
        this.historyEmptyStateText.textContent = "Go back to the 'Today' tab and create your tasks to build up consistency!";
      } else {
        this.historyEmptyStateTitle.textContent = "No tasks recorded";
        this.historyEmptyStateText.textContent = "No daily checklists were saved for this day. Streak counts require active tasks daily.";
      }
    } else {
      this.historyEmptyState.style.display = "none";
      
      tasks.forEach(task => {
        const item = document.createElement("div");
        item.className = `task-card ${task.completed ? 'completed' : ''}`;
        // Past tasks are read-only to represent strict record integrity
        item.style.pointerEvents = "none"; 
        item.innerHTML = `
          <div class="task-card-left">
            <button class="checkbox-btn" disabled aria-label="Task Status">
              <svg class="checkbox-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </button>
            <span class="task-text">${this.escapeHTML(task.text)}</span>
          </div>
        `;
        this.historyTaskList.appendChild(item);
      });
    }
  }

  // --- Analytics Dashboard Rendering ---
  renderAnalyticsDashboard() {
    const currentStreak = this.state.stats.currentStreak;
    const longestStreak = this.state.stats.longestStreak;
    const tier = getStreakTier(currentStreak);

    this.statsStreakNumber.textContent = currentStreak;
    this.statsLongestStreak.textContent = longestStreak;

    // --- Apply Streak Tier Visual Theme ---
    const card = document.getElementById("streakFlameContainer").closest(".streak-hero-card") ||
                 document.querySelector(".streak-hero-card");

    // Set CSS variables on the card for flame gradient stops
    card.style.setProperty("--flame-color-1", tier.flame[0]);
    card.style.setProperty("--flame-color-2", tier.flame[1]);
    card.style.setProperty("--flame-color-3", tier.flame[2]);
    card.style.setProperty("--flame-color-4", tier.flame[3]);
    card.style.setProperty("--flame-glow", tier.glow);
    card.style.setProperty("--flame-glow-bg", tier.glowBg);
    card.style.setProperty("--flame-title-color", tier.titleColor);

    // Flicker speed adjustments based on intensity
    const flickerSpeeds = { none: null, slow: "2.5s", normal: "1.5s", fast: "0.8s", ultra: "0.4s" };
    const speed = flickerSpeeds[tier.flickerSpeed];
    document.querySelectorAll(".flame-back, .flame-mid, .flame-front").forEach(el => {
      if (!speed) {
        el.style.animation = "none";
      } else {
        el.style.animationDuration = speed;
        el.style.animationPlayState = "running";
      }
    });

    // Outer glow on the flame container
    this.streakFlameContainer.style.filter =
      currentStreak > 0 ? `drop-shadow(0 0 20px ${tier.glow})` : "none";

    // Title & description with dynamic streak interpolation
    this.streakStatusTitle.textContent = tier.title;
    this.streakStatusDesc.textContent = tier.desc.replace("${streak}", currentStreak);

    // Show tier name badge below the number
    let tierBadgeEl = document.getElementById("streakTierBadge");
    if (!tierBadgeEl) {
      tierBadgeEl = document.createElement("div");
      tierBadgeEl.id = "streakTierBadge";
      tierBadgeEl.style.cssText = [
        "display:inline-flex", "align-items:center", "gap:5px",
        "padding:3px 12px", "border-radius:20px", "font-size:12px",
        "font-weight:700", "letter-spacing:0.5px", "margin-top:-4px",
        "margin-bottom:8px", "border:1px solid transparent",
        "transition:all 0.4s ease"
      ].join(";");
      // Insert between the flame container and the title
      this.streakStatusTitle.parentNode.insertBefore(tierBadgeEl, this.streakStatusTitle);
    }
    tierBadgeEl.textContent = `${tier.emoji}  ${tier.name.toUpperCase()}`;
    tierBadgeEl.style.background = tier.badgeGradient;
    tierBadgeEl.style.borderColor = tier.badgeBorder;
    tierBadgeEl.style.color = tier.titleColor;
    tierBadgeEl.style.boxShadow = `0 0 10px ${tier.glow}`;

    // Calculate high level stats
    let totalCreated = 0;
    let totalCompleted = 0;
    let successfulDays = 0;
    let monitoredDays = 0;

    // Scan all recorded dates in state
    Object.keys(this.state.tasks).forEach(dateStr => {
      const dayTasks = this.state.tasks[dateStr] || [];
      if (dayTasks.length > 0) {
        monitoredDays++;
        totalCreated += dayTasks.length;
        const allCompleted = dayTasks.every(t => t.completed);
        
        dayTasks.forEach(t => {
          if (t.completed) totalCompleted++;
        });

        if (allCompleted) {
          successfulDays++;
        }
      }
    });

    this.statsTotalCreated.textContent = totalCreated;
    this.statsTotalCompleted.textContent = totalCompleted;

    const rate = monitoredDays > 0 ? Math.round((successfulDays / monitoredDays) * 100) : 0;
    this.statsConsistency.textContent = `${rate}%`;

    // Rotate motivational quotes
    const quoteIndex = (currentStreak + totalCompleted) % MOTIVATIONAL_QUOTES.length;
    const activeQuote = MOTIVATIONAL_QUOTES[quoteIndex];
    this.motivationalQuote.textContent = `“${activeQuote.text}”`;
    this.motivationalAuthor.textContent = activeQuote.author;
  }

  // --- Settings Form Sync ---
  populateSettingsForm() {
    this.settingsUserName.value = this.state.settings.userName;
    this.settingsReminderEnabled.checked = this.state.settings.reminderEnabled;
    this.settingsReminderTime.value = this.state.settings.reminderTime;
  }

  // --- Time Travel Sandbox Simulation ---
  simulateTimeTravel(days) {
    this.state.timeTravelOffsetDays += days;
    
    // Recalculate everything for the new simulated day
    this.updateStreakEngine();
    this.historySelectedDateStr = this.getTodayDateString();
    
    this.renderAll();

    // Trigger visual notification of simulated travel
    alert(`📅 Sandbox Status: Traveled ${days} day(s) forward to ${this.getTodayDateString()}.`);
  }

  // --- Hard Reset ---
  resetAllData() {
    localStorage.removeItem("habitfire_state");
    this.state = {
      tasks: {},
      settings: {
        userName: "Achiever",
        reminderEnabled: true,
        reminderTime: "08:30"
      },
      stats: {
        currentStreak: 0,
        longestStreak: 0
      },
      timeTravelOffsetDays: 0,
      lastNotificationSentDate: null
    };
    this.simulatedNotifications = [];
    this.saveStateToStorage();
    this.switchScreen("screen-today");
    this.renderAll();
    alert("Application data fully cleared! Welcome to HabitFire 🔥");
  }

  // --- Export/Import Backup Utilities ---
  exportStateData() {
    try {
      const dataStr = JSON.stringify(this.state, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `habitfire_backup_${this.getTodayDateString()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (e) {
      alert("Failed to export backup data. Please try again.");
    }
  }

  handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.tasks && parsed.settings && parsed.stats) {
          this.state = parsed;
          this.saveStateToStorage();
          this.switchScreen("screen-today");
          this.renderAll();
          alert("Progress successfully restored! Welcome back 🏎️");
        } else {
          alert("Invalid backup file format. Could not restore progress.");
        }
      } catch (err) {
        alert("Failed to read backup file. Make sure it is a valid JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  // --- Utility: Safe Escape HTML string ---
  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // --- Google Authentication Integration ---
  checkGoogleAuthStatus() {
    const user = this.state.settings.googleUser;
    if (user) {
      this.welcomeModal.style.opacity = "0";
      this.welcomeModal.style.pointerEvents = "none";
      setTimeout(() => {
        this.welcomeModal.style.display = "none";
      }, 500);
    } else {
      if (this.sessionGuestMode) {
        this.welcomeModal.style.display = "none";
      } else {
        this.welcomeModal.style.display = "flex";
        this.welcomeModal.style.opacity = "1";
        this.welcomeModal.style.pointerEvents = "all";
      }
    }
  }

  openGoogleSignInSelector() {
    this.googlePopupModal.style.display = "flex";
    
    this.googleAccountsList.innerHTML = `
      <button class="google-account-btn" style="display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 20px; border: none; background: transparent; cursor: pointer; text-align: left; transition: background 0.2s;" data-name="DGiaLac" data-email="dgialac@gmail.com">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">D</div>
        <div style="display: flex; flex-direction: column;">
          <span style="font-size: 13px; font-weight: 700; color: #1c1921;">DGiaLac</span>
          <span style="font-size: 11px; color: #5f6368;">dgialac@gmail.com</span>
        </div>
      </button>
      <button class="google-account-btn" style="display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 20px; border: none; background: transparent; cursor: pointer; text-align: left; transition: background 0.2s; border-top: 1px solid #f1f3f4;" data-name="Friend Tester" data-email="tester@gmail.com">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #34a853; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">F</div>
        <div style="display: flex; flex-direction: column;">
          <span style="font-size: 13px; font-weight: 700; color: #1c1921;">Friend Tester</span>
          <span style="font-size: 11px; color: #5f6368;">tester@gmail.com</span>
        </div>
      </button>
      <button id="btnConnectCustomGoogle" style="display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 20px; border: none; background: transparent; cursor: pointer; text-align: left; transition: background 0.2s; border-top: 1px solid #f1f3f4; color: #1a73e8; font-weight: 600; font-size: 13px;">
        <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; color: #1a73e8; margin-right: 4px;"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        Connect Another Account
      </button>
    `;

    this.googleAccountsList.querySelectorAll(".google-account-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        const email = btn.getAttribute("data-email");
        this.selectGoogleAccount({ name, email });
      });
      btn.addEventListener("mouseover", () => btn.style.background = "#f8f9fa");
      btn.addEventListener("mouseout", () => btn.style.background = "transparent");
    });

    const btnConnectCustomGoogle = document.getElementById("btnConnectCustomGoogle");
    btnConnectCustomGoogle.addEventListener("click", () => {
      this.googleAccountsList.style.display = "none";
      this.googleCustomAccountForm.style.display = "flex";
    });
    btnConnectCustomGoogle.addEventListener("mouseover", () => btnConnectCustomGoogle.style.background = "#f8f9fa");
    btnConnectCustomGoogle.addEventListener("mouseout", () => btnConnectCustomGoogle.style.background = "transparent");
  }

  closeCustomAccountForm() {
    this.googleCustomAccountForm.style.display = "none";
    this.googleAccountsList.style.display = "flex";
    this.googleCustomName.value = "";
    this.googleCustomEmail.value = "";
  }

  submitCustomAccount() {
    const name = this.googleCustomName.value.trim();
    const email = this.googleCustomEmail.value.trim();
    if (!name || !email) {
      alert("Please fill in your name and email address.");
      return;
    }
    if (!email.includes("@")) {
      alert("Please enter a valid Google email address.");
      return;
    }
    this.selectGoogleAccount({ name, email });
  }

  selectGoogleAccount(account) {
    const picUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&background=00f2fe&color=ffffff&bold=true&size=128`;
    
    this.state.settings.googleUser = {
      name: account.name,
      email: account.email,
      picture: picUrl
    };
    this.state.settings.userName = account.name.split(" ")[0];

    this.saveStateToStorage();
    
    this.googlePopupModal.style.display = "none";
    this.googleCustomAccountForm.style.display = "none";
    this.googleAccountsList.style.display = "flex";
    this.googleCustomName.value = "";
    this.googleCustomEmail.value = "";

    this.checkGoogleAuthStatus();
    this.renderAll();

    alert(`🔐 Google Account Connected: Welcome, ${account.name}!`);
  }

  continueAsGuest() {
    this.sessionGuestMode = true;
    this.checkGoogleAuthStatus();
    this.renderAll();
  }

  signOutGoogle() {
    if (confirm("Are you sure you want to sign out of your Google Account?")) {
      this.state.settings.googleUser = null;
      this.state.settings.userName = "Achiever";
      this.sessionGuestMode = false;
      this.saveStateToStorage();
      
      this.checkGoogleAuthStatus();
      this.renderAll();
    }
  }

  renderGoogleProfileUI() {
    const user = this.state.settings.googleUser;
    
    if (user) {
      this.headerProfileAvatar.style.display = "block";
      this.headerProfilePic.src = user.picture;
      this.headerBrandEmoji.style.display = "none";

      this.settingsSignedOutView.style.display = "none";
      this.settingsSignedInView.style.display = "flex";
      this.settingsProfilePic.src = user.picture;
      this.settingsProfileName.textContent = user.name;
      this.settingsProfileEmail.textContent = user.email;
      
      if (this.settingsUserName) {
        this.settingsUserName.value = user.name;
      }
    } else {
      this.headerProfileAvatar.style.display = "none";
      this.headerBrandEmoji.style.display = "block";

      this.settingsSignedOutView.style.display = "flex";
      this.settingsSignedInView.style.display = "none";
    }
  }
}

// Instantiate the Application once the content is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.appInstance = new HabitFireApp();
});
