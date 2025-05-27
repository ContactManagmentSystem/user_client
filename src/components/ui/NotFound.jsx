/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const NotFound = ({ data, landing }) => {
  const dynamicColor = landing?.colourCode || "#EF4444";

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {/* Animated Icon */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-6xl mb-4"
        style={{ color: dynamicColor }}
      >
        🛒
      </motion.div>

      {/* Animated Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-lg font-semibold text-zinc-700"
      >
        no products in{" "}
        <span className="font-semibold" style={{ color: dynamicColor }}>
          {data}
        </span>
        <br />
      </motion.p>
    </div>
  );
};

export default NotFound;
