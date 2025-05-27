/* eslint-disable react/prop-types */
import { Typography, Divider } from "antd";
import { useManageStore } from "../../../store/useManageStore";

const { Text } = Typography;

const OrderDetail = ({ note }) => {
  const { items } = useManageStore();

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="space-y-3">
      <div className="text-base font-medium text-gray-800">{note}</div>
      <Divider className="my-2" />

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center text-sm text-gray-700"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span className="font-medium">
              Ks {(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <Divider className="my-3" />

      <div className="flex justify-between items-center text-base font-semibold">
        <span>Total:</span>
        <span>Ks {total.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default OrderDetail;
