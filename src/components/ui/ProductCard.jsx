/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useManageStore } from "../../store/useManageStore";
import useAlertStore from "../../store/alertStore";

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    position: "absolute",
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "relative",
  },
  exit: (direction) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    position: "absolute",
  }),
};

const ProductCard = ({ landing, product }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [delayMs, setDelayMs] = useState(getRandomDelay());
console.log(landing)
  const { addItem, removeItem, items } = useManageStore((state) => ({
    addItem: state.addItem,
    removeItem: state.removeItem,
    items: state.items,
  }));

  const showAlert = useAlertStore((state) => state.showAlert);
  const isInCart = items.some((item) => item._id === product._id);

  function getRandomDelay() {
    return Math.floor(Math.random() * 2000) + 2500;
  }

  useEffect(() => {
    if (!product.images?.length) return;

    const interval = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % product.images.length);
      setDelayMs(getRandomDelay());
    }, delayMs);

    return () => clearInterval(interval);
  }, [product.images, delayMs]);

  const currentImage = product.images?.[index];

  const calculateDiscount = (original, discountAmount) => {
    const price = parseFloat(original);
    const discount = parseFloat(discountAmount);
    if (!price || !discount || discount >= price) return null;
    const percent = Math.round((discount / price) * 100);
    return `${percent}% OFF`;
  };

  const discountText = calculateDiscount(product.price, product.discountPrice);
  const finalPrice = Math.max(0, product.price - product.discountPrice);

  const handleClick = (e) => {
    e.preventDefault();
    if (isInCart) {
      removeItem(product._id);
    } else {
      addItem(product);
      showAlert(`${product.name} added to cart`); // ✅ show alert
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="relative col-span-1 group">
      <div className="relative w-full h-[200px] lg:h-[500px] overflow-hidden border rounded shadow-md bg-white">
        {/* Discount Badge */}
        {discountText && (
          <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs lg:text-sm px-2 py-1 rounded-full shadow-md">
            {discountText}
          </div>
        )}

        {/* Image Slider */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={currentImage}
            src={currentImage}
            alt={product.name}
            className="object-cover w-full h-full"
            variants={slideVariants}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", ease: "easeInOut", duration: 0.5 },
              opacity: { duration: 0.5 },
            }}
          />
        </AnimatePresence>

        {product.images?.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md shadow-md backdrop-blur-sm">
            {index + 1} / {product.images.length}
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between w-full h-[200px] bg-white/20 backdrop-blur-sm text-gray-800 border shadow-md px-3 py-2">
        <div className="flex justify-between items-start lg:flex-row flex-col gap-2">
          <span className="text-xl border-b-2">{product.name}</span>
          <div className="flex flex-col text-start">
            {product.discountPrice > 0 && (
              <span className="text-sm line-through decoration-2 decoration-red-500">
                {product.price} {landing?.currency}
              </span>
            )}
            <span className="text-md lg:text-base font-semibold">
              {finalPrice} {landing?.currency}
            </span>
          </div>
        </div>

        <div className="text-sm line-clamp-3">{product.description}</div>

        <button
          onClick={handleClick}
          className={`mt-2 border-2 rounded px-3 py-1 text-sm font-medium transition ${
            isInCart
              ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              : "hover:bg-white hover:text-black"
          }`}
          style={
            !isInCart && landing?.colourCode
              ? {
                  borderColor: landing.colourCode,
                  color: landing.colourCode,
                }
              : {}
          }
        >
          {isInCart ? "Cancel" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
