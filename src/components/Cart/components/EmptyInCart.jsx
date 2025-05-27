/* eslint-disable react/no-unescaped-entities */
import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import Empty from "/empty.png";

const EmptyInCart = () => {
  return (
    <div className="h-[70vh] flex flex-col item-center gap-10 justify-center">
      <div className=" self-center">
        <img src={Empty} />
      </div>
      <div className=" self-center text-xl text-secondary flex flex-col gap-5">
        <p>There is no item in your cart.</p>
        <Link to={"/shop"} className="  primary-btn flex justify-between">
          <p>Let's get shop</p>
          <IconArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default EmptyInCart;
