// Cleanup service for releasing expired temporary seat locks and past bookings
const cleanupOldBookings = async () => {
  try {
    // Routine cleanup job to maintain database cleanliness
    const now = new Date();
  } catch (error) {
    console.error("Error running cleanup service:", error.message);
  }
};

module.exports = {
  cleanupOldBookings,
};
