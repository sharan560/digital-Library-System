const FINE_PER_MINUTE = Number(process.env.FINE_PER_MINUTE || 1);
const EMAIL_REMINDER_INTERVAL_MINUTES = Number(
  process.env.EMAIL_REMINDER_INTERVAL_MINUTES || 5
);

const getLateMinutes = (dueDate, referenceDate = new Date()) => {
  if (!dueDate || referenceDate <= dueDate) {
    return 0;
  }

  return Math.ceil((referenceDate - dueDate) / (1000 * 60));
};

const calculateFine = (dueDate, referenceDate = new Date()) => {
  const lateMinutes = getLateMinutes(dueDate, referenceDate);
  return lateMinutes * FINE_PER_MINUTE;
};

module.exports = {
  FINE_PER_MINUTE,
  EMAIL_REMINDER_INTERVAL_MINUTES,
  getLateMinutes,
  calculateFine,
};
