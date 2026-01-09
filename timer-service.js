// ===== TIMER SERVICE =====
class TimerService {
    constructor() {
        this.timers = {};
    }

    // Create a countdown timer
    createCountdown(id, durationMs, onTick, onExpire) {
        if (this.timers[id]) {
            this.clearTimer(id);
        }

        const endTime = Date.now() + durationMs;

        this.timers[id] = {
            endTime,
            interval: setInterval(() => {
                const remaining = endTime - Date.now();

                if (remaining <= 0) {
                    this.clearTimer(id);
                    if (onExpire) onExpire();
                } else {
                    if (onTick) onTick(remaining);
                }
            }, 1000)
        };

        return this.timers[id];
    }

    // Clear a timer
    clearTimer(id) {
        if (this.timers[id]) {
            clearInterval(this.timers[id].interval);
            delete this.timers[id];
        }
    }

    // Format time remaining
    formatTime(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);

        if (hours > 24) {
            const days = Math.floor(hours / 24);
            const remainingHours = hours % 24;
            return `${days}d ${remainingHours}h ${minutes}m`;
        }

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Calculate EMI due dates
    calculateEMIDueDates(startDate, tenure) {
        const dueDates = [];
        const start = new Date(startDate);

        for (let i = 0; i < tenure; i++) {
            const dueDate = new Date(start);
            dueDate.setMonth(start.getMonth() + i);
            dueDates.push(dueDate);
        }

        return dueDates;
    }

    // Check if EMI is due in next 5 days
    isEMIDueSoon(dueDate) {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays >= 0 && diffDays <= 5;
    }

    // Get next EMI due date
    getNextEMIDueDate(dueDates) {
        const today = new Date();
        return dueDates.find(date => new Date(date) > today);
    }
}

// ===== NOTIFICATION SERVICE =====
class NotificationService {
    constructor() {
        this.notifications = [];
    }

    // Send a notification (simulated)
    send(title, message, type = 'info') {
        const notification = {
            id: 'notif_' + Date.now(),
            title,
            message,
            type,
            timestamp: new Date().toISOString()
        };

        this.notifications.push(notification);

        // Show toast
        showToast(message, type);

        // Speak if voice enabled
        if (voiceAssistant && voiceAssistant.enabled) {
            voiceAssistant.speak(title + '. ' + message);
        }

        return notification;
    }

    // Send reminder
    sendReminder(title, message) {
        return this.send(title, message, 'warning');
    }

    // Get all notifications
    getAll() {
        return this.notifications;
    }

    // Clear notifications
    clear() {
        this.notifications = [];
    }
}

// Create global instances
const timerService = new TimerService();
const notificationService = new NotificationService();

// Export to window
window.timerService = timerService;
window.notificationService = notificationService;
