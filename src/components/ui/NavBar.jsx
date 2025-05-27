/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { Bell, ShoppingCart } from "phosphor-react";
import { useManageStore } from "../../store/useManageStore";
import useLandingStore from "../../store/LandingStore";

const NavBar = ({ padding = "" }) => {
  const cartCount = useManageStore((state) => state.items.length);
  const landingData = useLandingStore((state) => state?.landingData);

  const bgColor = landingData?.colourCode || "#ffffff";
  const logoSrc = landingData?.image || null;

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

      {/* Right: Notification + Cart */}
      <div className="flex items-center gap-4">
        <Link to={'/history'} className="relative">
          <Bell size={24} className="text-gray-700 hover:text-black" />
          <span
            style={{
              backgroundColor: bgColor,
            }}
            className="absolute top-0 right-0 w-2 h-2 rounded-full "
          />
        </Link>

        <Link to="/cart" className="relative">
          <ShoppingCart size={24} className="text-gray-700 hover:text-black" />
          {cartCount > 0 && (
            <span
              style={{
                backgroundColor: bgColor,
              }}
              className="absolute -top-2 -right-2  text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full"
            >
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
