import { motion } from "framer-motion";
import { useGetLanding } from "../../api/hooks/useQuery";

const Loading = () => {
  const { data: landing } = useGetLanding();
  const dynamicColor = landing?.data?.colourCode || "#EF4444"; 

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white gap-4">
      <motion.div
        className="w-6 h-6 rounded-full"
        style={{ backgroundColor: dynamicColor }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.p
        className="text-sm font-medium"
        style={{ color: dynamicColor }}
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default Loading;
