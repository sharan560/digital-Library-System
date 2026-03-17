import { motion } from "framer-motion";

const StatCard = ({ title, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="ui-panel p-4"
  >
    <p className="ui-muted text-sm">{title}</p>
    <p className="ui-title mt-2 text-3xl font-semibold">{value}</p>
  </motion.div>
);

export default StatCard;
