import { motion } from "framer-motion";

const StatCard = ({ title, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
  >
    <p className="text-sm text-slate-400">{title}</p>
    <p className="mt-2 text-3xl font-semibold text-amber-300">{value}</p>
  </motion.div>
);

export default StatCard;
