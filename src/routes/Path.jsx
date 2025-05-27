/* File: Path.jsx */
import {
  IconHome,
  IconShoppingBag,
  IconTimeDurationOff,
} from "@tabler/icons-react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Cart from "../components/Cart";
import History from "../components/History";
import Product from "../components/Product";
import { useGetLanding } from "../api/hooks/useQuery";
import useLandingStore from "../store/LandingStore";
import Loading from "../components/ui/Loading";
import { useEffect } from "react";

const PublicRoute = ({ element }) => element;

const Path = () => {
  const { data: landing, isLoading } = useGetLanding();
  const setLandingData = useLandingStore((state) => state.setLandingData);

  useEffect(() => {
    if (landing?.data) {
      setLandingData(landing?.data);
    }
  }, [landing?.data, setLandingData]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center  text-white">
        <Loading />
      </div>
    );
  }

  const publicRoutes = [
    {
      path: "/",
      element: <Home landing={landing?.data} />,
      icon: <IconHome />,
    },
    {
      path: "/product/:id",
      element: <Product landing={landing?.data} />,
      icon: <IconHome />,
    },
    {
      path: "/history",
      element: <History landing={landing?.data} />,
      icon: <IconTimeDurationOff />,
    },
    {
      path: "/cart",
      element: <Cart landing={landing?.data} />,
      icon: <IconShoppingBag />,
    },
  ];

  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<PublicRoute element={route.element} />}
        />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Path;
