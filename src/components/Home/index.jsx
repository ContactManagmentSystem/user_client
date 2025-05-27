/* eslint-disable react/prop-types */
import MenuSection from "./components/MenuSection";

const Home = ({ landing }) => {
  return (
    <div className="main-font overflow-hidden">
      <MenuSection landing={landing} />
    </div>
  );
};

export default Home;
