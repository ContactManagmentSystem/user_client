import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle } from "phosphor-react";
import useAlertStore from "../../store/alertStore";

const CartAlert = () => {
  const { message, visible } = useAlertStore();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed left-1/2 top-1/2 w-[60%] -translate-x-1/2 -translate-y-1/2 z-[9999] px-6 py-4 rounded-xl bg-black/90 text-white shadow-xl flex items-center gap-3 max-w-sm  text-center backdrop-blur-md"
        >
          <CheckCircle size={24} className="text-green-400" />
          <span className="text-sm font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartAlert;
