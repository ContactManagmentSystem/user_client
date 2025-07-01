/* eslint-disable react/prop-types */
import ShowCase from "./ShowCase";
import { Skeleton, Alert } from "antd";
import HeroSlice from "./HeroSlice";

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
  // console.log(landing);
  return (
    <div className=" flex flex-col gap-5 ">
      {/* <motion.div
        className="main-font text-gray-900 text-[28px] sm:text-[40px] md:text-[60px] font-semibold leading-tight md:leading-[1.1] tracking-tight max-w-full md:max-w-[80%] break-words md:text-left"
        initial="hidden"
        animate="visible"
      >
          {landing.storeName}
      </motion.div> */}
      <div className='px-2 pt-2'>
        <HeroSlice landing={landing} />
      </div>

      <div className="border-t md:px-10 px-5 border-white/20">
        <ShowCase landing={landing} />
      </div>
    </div>
  );
};

export default MenuSection;
