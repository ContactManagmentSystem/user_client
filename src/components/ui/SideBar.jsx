import { Link, useLocation } from "react-router-dom";
import {
  IconClock12,
  IconHome,
  IconPackage,
  IconShoppingBag,
} from "@tabler/icons-react";

const SideBar = () => {
  const location = useLocation();

  const menuData = [
    { path: "/", name: "Home", icon: <IconHome size={18} /> },
    { path: "/shop", name: "Shop", icon: <IconPackage size={18} /> },
    { path: "/history", name: "History", icon: <IconClock12 size={18} /> },
    { path: "/cart", name: "Cart", icon: <IconShoppingBag size={18} /> },
  ];

  const hiddenPaths = [
    "/auth/signup",
    "/auth/login",
    "/auth/otp",
    "/blog",
    "/blog/:id",
  ];

  const isHidden = hiddenPaths.some((path) => {
    if (path.includes("/:id")) {
      const basePath = path.split("/:id")[0];
      return location.pathname.startsWith(basePath);
    }
    return location.pathname === path;
  });

  return (
    <div
      className={`z-50 sticky bottom-5 flex items-center justify-center ${
        isHidden ? "hidden" : ""
      }`}
    >
      <div className="bg-[#8EACCD]/40 backdrop-blur-md px-5 py-2 flex justify-around w-[85%] rounded-lg">
        {menuData.map(({ path, name, icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link to={path} key={name}>
              <div
                className={`p-2 px-5 text-white rounded-lg shadow-lg shadow-zinc-500/50 transition-transform duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#7C93C3] to-[#55679C] transform translate-y-[-20px]"
                    : "bg-gradient-to-r from-[#7C93C3] to-[#55679C]"
                }`}
              >
                {icon}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;
