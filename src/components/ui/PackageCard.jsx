/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import Modal from "./Modal";
import { useManageStore } from "../../store/useManageStore";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import Package from "/package.jpg";

// Utility function to split image URLs
export const splitImageUrls = (imageUrls) => {
  return imageUrls ? imageUrls.split(",") : [];
};

const PackageCard = ({ el }) => {
  const addItem = useManageStore((state) => state.addItem);
  const removeItem = useManageStore((state) => state.removeItem);
  const cartItems = useManageStore((state) => state.items);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const nav = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isPackageInCart = cartItems?.some((item) => item._id === el._id);

  const handleButtonClick = () => {
    if (isAuthenticated()) {
      if (isPackageInCart) {
        removeItem(el._id);
      } else {
        addItem(el);
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    nav("/auth/login");
  };

  // Split the image URLs
  const imageUrls = splitImageUrls(el?.image);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [imageUrls.length]);

  return (
    <div
      key={el._id}
      className="w-full border rounded shadow-lg p-5 flex flex-col gap-5 bg-gradient-to-tr from-indigo-100 to-violet-100"
    >
      <div className="w-full flex">
        <div className="w-1/2 text-xl flex flex-col justify-around">
          <div>{el.name}</div>
          <p>${el.price}</p>
        </div>
        <div className="w-1/2 h-[100px] relative overflow-hidden">
          <AnimatePresence>
            {imageUrls.length > 0 ? (
              <motion.img
                key={imageUrls[currentImageIndex]} // Ensure Framer Motion detects image change
                className="rounded w-full h-full object-cover absolute"
                src={imageUrls[currentImageIndex]}
                alt={el.name}
                initial={{ opacity: 0, x: 150 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 150 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <motion.img
                key="default-image"
                className="rounded w-full h-full object-cover"
                src={Package}
                alt={el.name}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
      <div>
        <h1 className="text-lg text-gray-700 hero-font mb-5">
          What are they include
        </h1>
        <div className="flex flex-col gap-3">
          {el.include?.map((item) => (
            <div className="flex justify-start " key={item.name}>
              <div className="w-2/3 text-xl flex flex-col justify-start gap-3">
                <div>{item.name}</div>
                <div className="text-gray-600 text-sm">{item.description}</div>
              </div>
              <div className="w-1/3">
                <img
                  className="w-full h-full object-cover rounded"
                  src={item?.image}
                  alt={item.name}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleButtonClick}
        className={`${
          isPackageInCart
            ? "bg-red-600"
            : "bg-gradient-to-r from-violet-600 to-indigo-600"
        } shadow-lg rounded-xl text-white gap-3 p-2 flex px-5 items-center`}
      >
        {isPackageInCart ? (
          <>
            <IconMinus size={15} /> Remove
          </>
        ) : (
          <>
            <IconPlus size={15} /> Add to Cart
          </>
        )}
      </button>
      {/* Reusable Modal Component */}
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <p className="text-lg">You need to log in to perform this action.</p>
        <div>
          <button onClick={handleLoginRedirect} className="gradient-btn">
            Go to Login
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PackageCard;
