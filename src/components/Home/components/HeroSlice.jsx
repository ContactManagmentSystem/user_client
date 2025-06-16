/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HeroSlice = ({ landing }) => {
  const [[current, direction], setCurrent] = useState([0, 0]);

  const heroImage = landing?.heroImage || [];
  const colourCode = landing?.colourCode || "#ffffff";

  const paginate = (newDirection) => {
    setCurrent([
      (current + newDirection + heroImage.length) % heroImage.length,
      newDirection,
    ]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [current, heroImage.length]);

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  if (!heroImage.length) return null;

  return (
    <div className="relative w-full max-w-5xl mx-auto h-64 md:h-96 overflow-hidden rounded-lg shadow-xl border bg-black">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={heroImage[current]}
          src={heroImage[current]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
          }}
          className="absolute w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Left Arrow */}
      {/* <button
        onClick={() => paginate(-1)}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 rounded-full shadow transition"
        style={{ backgroundColor: `${colourCode}80` }}
      >
        <CaretLeft size={24} weight="bold" className="text-white" />
      </button> */}

      {/* Right Arrow */}
      {/* <button
        onClick={() => paginate(1)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 rounded-full shadow transition"
        style={{ backgroundColor: `${colourCode}80` }}
      >
        <CaretRight size={24} weight="bold" className="text-white" />
      </button> */}

      {/* Dots */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {heroImage.map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full transition"
            style={{
              backgroundColor: i === current ? colourCode : "#555555",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlice;
