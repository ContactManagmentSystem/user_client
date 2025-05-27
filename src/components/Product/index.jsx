/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetProductById } from "../../api/hooks/useQuery";
import { motion } from "framer-motion";
import Loading from "../ui/Loading";
import { useManageStore } from "../../store/useManageStore";

const Product = ({ landing }) => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetProductById(id);
  const product = data?.data;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product?.images || [];

  const { addItem, removeItem, items } = useManageStore((state) => ({
    addItem: state.addItem,
    removeItem: state.removeItem,
    items: state.items,
  }));

  const isInCart = useMemo(() => {
    if (!product) return false;
    return items.some((item) => item._id === product._id);
  }, [items, product]);

  useEffect(() => {
    if (!images.length) return;
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loading />
      </div>
    );

  if (error)
    return <div className="text-red-600 p-4">Error: {error.message}</div>;

  if (!product)
    return <div className="text-gray-500 p-4">No product found.</div>;

  const finalPrice = Math.max(0, product.price - product.discountPrice);
  const hasDiscount =
    product.discountPrice > 0 && product.discountPrice < product.price;

  const primaryColor = landing?.colourCode || "#007bff";

  return (
    <div className="max-w-7xl mx-auto text-gray-800">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Image Slider */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="relative w-full h-[400px] max-w-xl rounded-lg overflow-hidden shadow-lg bg-white flex items-center justify-center">
            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt={`Product ${currentImageIndex + 1}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="object-contain w-full h-full p-6"
            />
          </div>

          <div className="flex gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className="w-3 h-3 rounded-full transition border"
                style={{
                  backgroundColor:
                    index === currentImageIndex ? primaryColor : "#ccc",
                  borderColor:
                    index === currentImageIndex ? primaryColor : "#ccc",
                }}
              ></button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full p-4 lg:w-1/2 flex flex-col justify-center text-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-2xl font-bold text-red-600">
                    {finalPrice} Ks
                  </span>
                  <span className="text-lg line-through text-gray-400">
                    {product.price} Ks
                  </span>
                </>
              ) : (
                <span className="text-2xl font-semibold">
                  {product.price} Ks
                </span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-700 mb-1">
              Product Description
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-1">
                Stock Count
              </h4>
              <p className="text-sm text-gray-500">
                {product.stockCount} items available
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-1">
                Category
              </h4>
              {product.category?.name && (
                <span
                  className="inline-block px-4 py-1 border text-sm border-gray-300 font-medium rounded-full shadow"
                  style={{
                    color: primaryColor,
                  }}
                >
                  {product.category.name}
                </span>
              )}
            </div>
          </div>

          {isInCart ? (
            <button
              onClick={() => removeItem(product._id)}
              className="py-3 px-6 rounded-lg font-semibold border transition duration-300 shadow-sm hover:shadow-lg"
              style={{
                color: "#dc2626",
                borderColor: "#dc2626",
                backgroundColor: "transparent",
              }}
            >
              Remove from Cart
            </button>
          ) : (
            <button
              onClick={() => addItem(product)}
              className="py-3 px-6 rounded-lg font-semibold border transition duration-300 shadow-sm hover:shadow-lg"
              style={{
                color: primaryColor,
                borderColor: primaryColor,
                backgroundColor: "transparent",
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
