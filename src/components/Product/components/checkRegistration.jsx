/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { usePostVerifyCode } from "../../../api/hooks/useQuery";
import Robot from "./robot";

const CheckRegistration = ({ isDrawerOpen, toggleDrawer }) => {
  const [code, setCode] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const { mutate, isLoading, isError, error, data } = usePostVerifyCode();

  console.log(data);

  const handleInputChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedCode(code);
    mutate(code);
  };

  useEffect(() => {
    if (submittedCode) {
      // You could add any additional side effects based on the submitted code here if needed
    }
  }, [submittedCode]);

  return (
    <Drawer anchor="bottom" open={isDrawerOpen} onClose={toggleDrawer(false)}>
      <Box
        sx={{
          height: "80vh",
          padding: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <h2 className="text-lg underline font-semibold text-center mb-4 text-red-700">
            Check Registration
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col-reverse gap-4 h-full justify-end "
          >
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={code}
                onChange={handleInputChange}
                placeholder="Enter Unique Code"
                className={`p-3 border-2 outline-gray-600 ${
                  error ? "border-red-700" : "border-green-700"
                } w-full border-gray-300 rounded-lg`}
                required
              />
              <button
                type="submit"
                className=" bg-green-500 text-sm font-bold text-white w-full py-2 px-4 rounded-lg hover:bg-green-600"
              >
                CHECK
              </button>
            </div>
            <div className="text-sm h-[50vh] flex items-center">
              {data ? (
                <>
                  {isLoading && <p>Loading...</p>}
                  {isError && (
                    <p className="text-red-600">
                      {error?.response?.data.message}
                    </p>
                  )}
                  {data && data?.data?.owner && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-center"
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        Congratulations,{" "}
                        <span className="font-bold text-green-700">
                          {data?.data?.owner.username}
                        </span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        With your unique code{" "}
                        <span className="font-bold text-green-700">
                          {data?.data?.uniqueCode}
                        </span>{" "}
                        of{" "}
                        <span className="font-bold text-green-700">
                          {data?.data?.productId.name} ({data?.data?.size})
                        </span>
                        , you now own this special piece of clothing from us!
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        We’re thrilled to have you as part of our community.
                        Your purchase is not just a transaction—it’s a lasting
                        memory, and we’ll always remember your name as part of
                        our story. Thank you for choosing us, and we can’t wait
                        to see you again for more amazing pieces. Wear it
                        proudly, and remember, this is just the beginning!
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        Cheers, The{" "}
                        <span className="font-bold text-green-700">
                          JUST LWINT
                        </span>{" "}
                        Team
                      </motion.div>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="flex justify-center w-full">
                  <Robot />
                  <span className="hero-font text-red-700">
                    Let`s find out who is owner!!
                  </span>
                </div>
              )}
            </div>
          </form>
        </motion.div>
      </Box>
    </Drawer>
  );
};

export default CheckRegistration;
