/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bell, ShoppingCart, MagnifyingGlass, X } from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";
import { useManageStore } from "../../store/useManageStore";
import useLandingStore from "../../store/LandingStore";
import useProductManageStore from "../../store/productManageStore";

const NavBar = ({ padding = "" }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [localSearchInput, setLocalSearchInput] = useState("");

  const cartCount = useManageStore((state) => state.items.length);
  const landingData = useLandingStore((state) => state?.landingData);
  const { setFilter, setSearchInput } = useProductManageStore((state) => ({
    setFilter: state.setFilter,
    setSearchInput: state.setSearchInput,
  }));

  const bgColor = landingData?.colourCode || "#A70000";
  const logoSrc = landingData?.image || null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = localSearchInput.trim();
    setSearchInput(trimmed);
    setFilter("all");
  };

  // Reset to all when input becomes empty
  useEffect(() => {
    const trimmed = localSearchInput.trim();
    if (trimmed === "") {
      setSearchInput("");
      setFilter("all");
    }
  }, [localSearchInput, setSearchInput, setFilter]);

  // Track previous cartCount to animate only when increased
  const prevCartCount = useRef(cartCount);
  const isCartIncreased = cartCount > prevCartCount.current;

  useEffect(() => {
    prevCartCount.current = cartCount;
  }, [cartCount]);

  return (
    <div
      className={`w-full sticky top-0 z-50 bg-white p-4 flex justify-between items-center shadow-md ${padding}`}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoSrc}
            alt="Store Logo"
            className="w-10 h-10 rounded-full object-cover shadow"
          />
        </Link>
      </div>

      {/* Center/Right: Search Bar or Icons */}
      <div className="flex-1 flex justify-end">
        <AnimatePresence mode="wait">
          {showSearch ? (
            <motion.form
              key="search"
              onSubmit={handleSearchSubmit}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center mx-4 max-w-md w-full bg-gray-100 rounded-full overflow-hidden shadow-sm"
            >
              <input
                type="text"
                value={localSearchInput}
                onChange={(e) => setLocalSearchInput(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setLocalSearchInput("");
                }}
                className="p-2 hover:bg-gray-200 transition"
              >
                <X size={20} />
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="icons"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={() => setShowSearch(true)}
                className="hover:bg-gray-100 p-2 rounded-full transition"
              >
                <MagnifyingGlass size={22} className="text-gray-700" />
              </button>

              <Link to="/history" className="relative">
                <Bell size={22} className="text-gray-700 hover:text-black" />
                <span
                  style={{ backgroundColor: bgColor }}
                  className="absolute top-0 right-0 w-2 h-2 rounded-full"
                />
              </Link>

              <Link to="/cart" className="relative">
                <motion.div
                  key={cartCount}
                  animate={isCartIncreased ? { y: [-4, 0, -2, 0] } : {}}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <ShoppingCart
                    size={22}
                    className="text-gray-700 hover:text-black"
                  />
                </motion.div>

                {cartCount > 0 && (
                  <span
                    style={{ backgroundColor: bgColor }}
                    className="absolute -top-2 -right-2 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NavBar;
