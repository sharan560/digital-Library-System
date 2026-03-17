const DAILY_FINE = Number(process.env.DAILY_FINE || 10);

const getLateDays = (dueDate, referenceDate = new Date()) => {
  if (!dueDate || referenceDate <= dueDate) {
    return 0;
  }

  return Math.floor((referenceDate - dueDate) / (1000 * 60 * 60 * 24));
};

const calculateFine = (dueDate, referenceDate = new Date()) => {
  const lateDays = getLateDays(dueDate, referenceDate);
  return Math.max(0, lateDays * DAILY_FINE);
};

module.exports = {
  DAILY_FINE,
  getLateDays,
  calculateFine,
};
