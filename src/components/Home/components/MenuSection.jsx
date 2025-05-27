/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import ShowCase from "./ShowCase";
import { Skeleton, Alert } from "antd";

const MenuSection = ({ landing }) => {
  if (!landing) {
    return (
      <div className="md:p-10 p-5">
        <Skeleton
          active
          title={{ width: 300 }}
          paragraph={{ rows: 2 }}
          className="mb-4"
        />
        <Alert
          message="Store data not available"
          description="Landing information is currently unavailable. Please try again later."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="md:p-10 p-5 flex flex-col gap-5 md:gap-10">
      <motion.div
        className="main-font text-gray-900 text-[28px] sm:text-[40px] md:text-[60px] font-semibold leading-tight md:leading-[1.1] tracking-tight max-w-full md:max-w-[80%] break-words md:text-left"
        initial="hidden"
        animate="visible"
      >
          {landing.storeName}
      </motion.div>

      <div className="border-t border-white/20 pt-4">
        <ShowCase landing={landing} />
      </div>
    </div>
  );
};

export default MenuSection;
