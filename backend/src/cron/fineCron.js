const cron = require("node-cron");
const Transaction = require("../models/Transaction");
const {
  calculateFine,
  getLateMinutes,
  EMAIL_REMINDER_INTERVAL_MINUTES,
} = require("../utils/fine");
const { hasEmailConfig, sendFineReminderEmail } = require("../services/emailService");

const updateMinuteWiseFines = async () => {
  const now = new Date();
  const pending = await Transaction.find({ status: { $in: ["issued", "overdue"] } });

  await Promise.all(
    pending.map(async (tx) => {
      if (tx.returnDate) return;

      const fine = calculateFine(tx.dueDate, now);
      if (fine > 0) {
        tx.status = "overdue";
        tx.fine = fine;
        await tx.save();
      }
    })
  );
};

const notifyOverdueFines = async () => {
  if (!hasEmailConfig()) {
    return;
  }

  const now = new Date();
  const overdueTransactions = await Transaction.find({
    status: "overdue",
    fine: { $gt: 0 },
    isFinePaid: false,
  })
    .populate("userId", "name email emailNotificationsOptIn")
    .populate("bookId", "title");

  await Promise.all(
    overdueTransactions.map(async (tx) => {
      if (!tx.userId?.email || tx.userId.emailNotificationsOptIn === false) {
        return;
      }

      const lastNotifiedAt = tx.lastFineNotifiedAt ? new Date(tx.lastFineNotifiedAt) : null;
      const elapsedMinutes = lastNotifiedAt
        ? (now - lastNotifiedAt) / (1000 * 60)
        : EMAIL_REMINDER_INTERVAL_MINUTES;

      if (elapsedMinutes < EMAIL_REMINDER_INTERVAL_MINUTES) {
        return;
      }

      if (getLateMinutes(tx.dueDate, now) < 1) {
        return;
      }

      try {
        await sendFineReminderEmail({
          user: tx.userId,
          book: tx.bookId,
          transaction: tx,
        });

        tx.lastFineNotifiedAt = now;
        tx.fineNotificationCount += 1;
        await tx.save();
      } catch (error) {
        console.error(`Fine email reminder failed for transaction ${tx._id}:`, error.message);
      }
    })
  );
};

const startFineCron = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await updateMinuteWiseFines();
    } catch (error) {
      console.error("Fine cron failed:", error.message);
    }
  });

  cron.schedule("*/5 * * * *", async () => {
    try {
      await notifyOverdueFines();
    } catch (error) {
      console.error("Email fine reminder cron failed:", error.message);
    }
  });

  console.log("Minute fine cron and email reminder cron started");
};

module.exports = { startFineCron };
