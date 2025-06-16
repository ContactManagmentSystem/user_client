/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useGetProduct } from "../../../api/hooks/useQuery";
import { useGetCate } from "../../../api/hooks/useCate";
import useProductManageStore from "../../../store/productManageStore";
import Loading from "../../ui/Loading";
import ProductCard from "../../ui/ProductCard";
import NotFound from "../../ui/NotFound";
import { motion } from "framer-motion";

const ShowCase = ({ landing }) => {
  const { data: category } = useGetCate(1, 10);
  const {
    setProducts,
    filteredProducts,
    filter,
    setFilter,
    searchInput,
  } = useProductManageStore((state) => ({
    setProducts: state.setProducts,
    filteredProducts: state.filteredProducts,
    filter: state.filter,
    setFilter: state.setFilter,
    searchInput: state.searchInput,
    setSearchInput: state.setSearchInput,
  }));

  const {
    data: products,
    error,
    isLoading,
    refetch,
  } = useGetProduct(1, 50, "all", searchInput, filter === "all" ? "" : filter);

  useEffect(() => {
    if (products?.data) {
      setProducts(products.data);
    }
  }, [products, setProducts]);

  useEffect(() => {
    refetch();
  }, [searchInput, filter]);

  const primaryColor = landing?.colourCode || "#A70000";

  return (
    <div className="flex flex-col gap-5">
      {/* Category Filter */}
      <div
        className="overflow-x-auto custom-scrollbar py-2"
        style={{ "--scrollbar-thumb": primaryColor }}
      >
        <div className="flex gap-4 overflow-x-auto custom-scrollbar">
          <motion.div
            onClick={() => setFilter("all")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center my-2 gap-3 px-4 py-2 rounded-full shadow-sm border-2 whitespace-nowrap transition-all duration-200 cursor-pointer min-w-max ${
              filter === "all"
                ? "bg-white text-white"
                : "bg-white text-gray-800 border-gray-300"
            }`}
            style={
              filter === "all"
                ? { color: primaryColor, borderColor: primaryColor }
                : {}
            }
          >
            <div className="w-20 h-8 flex items-center justify-center text-xs font-bold">
              ALL
            </div>
          </motion.div>

          {category?.data?.map((el) => {
            const isActive = filter === el.name;
            return (
              <motion.div
                key={el._id}
                onClick={() => setFilter(el.name)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 my-2 px-4 py-2 rounded-full shadow-sm border-2 whitespace-nowrap transition-all duration-200 cursor-pointer min-w-max ${
                  isActive
                    ? "bg-white text-white"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
                style={
                  isActive
                    ? { color: primaryColor, borderColor: primaryColor }
                    : {}
                }
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border">
                  <img
                    src={el.image}
                    alt={el.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="uppercase text-sm font-semibold">{el.name}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[300px]">
        {isLoading ? (
          <div className="col-span-2 flex justify-center py-10">
            <Loading />
          </div>
        ) : error ? (
          <div className="col-span-2 text-red-600 text-center">
            Error loading products: {error.message}
          </div>
        ) : filteredProducts()?.length > 0 ? (
          filteredProducts().map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard landing={landing} product={product} />
            </motion.div>
          ))
        ) : (
          <div className="h-[60vh] col-span-2 flex justify-center w-full">
            <NotFound landing={landing} data={filter} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowCase;
