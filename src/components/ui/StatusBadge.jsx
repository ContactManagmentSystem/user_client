/* eslint-disable react/prop-types */
import { Badge } from "antd";

// Define a mapping of status to color and text
const statusMap = {
  declined: { color: "red", text: "Declined" },
  pending: { color: "orange", text: "Pending" },
  accepted: { color: "green", text: "Accepted" },
  done: { color: "blue", text: "Done" },
};

const StatusBadge = ({ status }) => {
  // Determine the color and text based on the status
  const { color, text } = statusMap[status] || {};

  return (
    <div className="bg-white rounded-full flex items-center justify-center p-1">
      <Badge size="default" color={color} text={text} />
    </div>
  );
};

export default StatusBadge;
