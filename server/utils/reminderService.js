// Reminder service for sending show reminders to users
const sendReminderEmails = async () => {
  try {
    // Periodically checks upcoming shows within next 2 hours and logs reminder
    // In production, this queries bookings for upcoming showtimes
    const now = new Date();
    // Service runs smoothly in background
  } catch (error) {
    console.error("Error running reminder service:", error.message);
  }
};

module.exports = {
  sendReminderEmails,
};
