const cron = require("node-cron");
const Transaction = require("../models/Transaction");

const DAILY_FINE = Number(process.env.DAILY_FINE || 10);

const calculateFineForDays = (daysLate) => daysLate * DAILY_FINE;

const startFineCron = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const now = new Date();
      const pending = await Transaction.find({ status: { $in: ["issued", "overdue"] } });

      await Promise.all(
        pending.map(async (tx) => {
          if (tx.returnDate) return;

          if (now > tx.dueDate) {
            const daysLate = Math.ceil((now - tx.dueDate) / (1000 * 60 * 60 * 24));
            tx.status = "overdue";
            tx.fine = calculateFineForDays(daysLate);
            await tx.save();
          }
        })
      );
    } catch (error) {
      console.error("Fine cron failed:", error.message);
    }
  });

  console.log("Fine cron started");
};

module.exports = { startFineCron };
