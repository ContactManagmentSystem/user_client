// src/components/History/index.jsx
import { Timeline } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { formatDate } from "../../utils/fun";
import Loading from "../ui/Loading";
import EmptyHistory from "/history.png";
import { useManageStore } from "../../store/useManageStore";
import { useQueries } from "@tanstack/react-query";
import { getOrderById } from "../../api/services/service";

const History = () => {
  const { orderHistory } = useManageStore((state) => ({
    orderHistory: state.orderHistory,
  }));

  const orderQueries = useQueries({
    queries: orderHistory.map((id) => ({
      queryKey: ["order", id],
      queryFn: () => getOrderById(id),
      enabled: !!id,
    })),
  });

  const isLoading = orderQueries.some((q) => q.isLoading);
  const hasError = orderQueries.find((q) => q.error);

  const mappedOrders = orderQueries.map((q, index) => ({
    id: orderHistory[index],
    data: q.data,
  }));

  if (isLoading) return <Loading />;

  if (hasError) {
    return (
      <div className="text-red-600 text-center">
        Error: {hasError.error.message}
      </div>
    );
  }

  if (mappedOrders?.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 text-center">
        <img
          src={EmptyHistory}
          className="w-[200px] mb-4"
          alt="Empty History"
        />
        <p className="text-lg font-semibold text-gray-600">
          No orders in your history yet.
        </p>
      </div>
    );
  }

  const timelineItems = mappedOrders.map((order) => {
    const orderData = order.data?.data;
    const totalItems = orderData?.products.length || 0;
    const totalPrice = orderData?.products.reduce((sum, p) => {
      const unitPrice = p.productId?.price || 0;
      return sum + unitPrice * (p.quantity || 1);
    }, 0);

    return {
      key: order.id,
      label: (
        <span className="text-sm text-gray-500">
          {formatDate(orderData?.createdAt)}
        </span>
      ),
      dot: (
        <ClockCircleOutlined
          className="text-blue-500"
          style={{ fontSize: "16px" }}
        />
      ),
      children: (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-3">
          <div className="space-y-1">
            <p className="text-base font-semibold text-gray-800">
              Order ID: <span className="text-blue-600">{order.id}</span>
            </p>
            <p className="text-sm text-gray-600">
              Address:{" "}
              <span className="text-gray-800">{orderData?.address}</span>
            </p>
            <p className="text-sm text-gray-600">
              Primary Phone:{" "}
              <span className="text-gray-800">{orderData?.phonePrimary}</span>
            </p>
            <p className="text-sm text-gray-600">
              Secondary Phone:{" "}
              <span className="text-gray-800">
                {orderData?.phoneSecondary || "-"}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Payment Type:{" "}
              <span className="text-gray-800">{orderData?.paymentType}</span>
            </p>
            <p className="text-sm text-gray-600">
              Progress:{" "}
              <span className="text-yellow-600 font-medium">
                {orderData?.progress}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Total Items:{" "}
              <span className="font-medium text-gray-700">{totalItems}</span>
            </p>
            <p className="text-sm text-gray-600">
              Products:{" "}
              <span className="font-medium text-gray-700 block space-y-1">
                {orderData?.products?.map((el, i) => (
                  <span key={i} className="block">
                    {el.productId?.name} × {el.quantity}
                  </span>
                ))}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Total Amount:{" "}
              <span className="font-medium text-green-600">
                {totalPrice.toLocaleString()} Ks
              </span>
            </p>
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        Order History
      </h2>
      <div className="max-w-3xl mx-auto">
        <Timeline mode="left" items={timelineItems} />
      </div>
    </div>
  );
};

export default History;
