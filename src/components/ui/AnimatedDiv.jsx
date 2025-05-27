import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import SemiHero from "/semi_hero2.jpg";

function AnimatedDiv() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false, 
    threshold: 0.5, 
  });

  useEffect(() => {
    if (inView) {
      controls.start({
        y: 20,
        x: 20,
        opacity: 1,
        transition: { duration: 1, ease: "easeOut" },
      });
    }
  }, [controls, inView]);

  return (
    <div className="overflow-hidden relative shadow-lg rounded-lg col-span-2 w-full">
      <motion.div
        ref={ref}
        className="absolute md:top-20 text-white border-b-2"
        initial={{ x: 100, y: 20, opacity: 0 }}
        animate={controls}
      >
        Feel the taste of Japanese foods
      </motion.div>
      <img
        className="object-cover w-full h-full"
        src={SemiHero}
        alt="heroimg"
      />
    </div>
  );
}

export default AnimatedDiv;
