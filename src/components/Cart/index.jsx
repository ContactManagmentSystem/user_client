/* eslint-disable react/prop-types */
import { useState } from "react";
import { useManageStore } from "../../store/useManageStore";
import {
  WhatsappLogo,
  TelegramLogo,
  EnvelopeSimple,
  ChatCircleDots,
  LineSegment,
} from "phosphor-react";
import ConfirmModal from "./components/ConfirmModal";

const formatPrice = (num) => new Intl.NumberFormat("en-US").format(num);

const Cart = ({ landing }) => {
  const { items, increaseQuantity, decreaseQuantity, removeItem } =
    useManageStore((state) => ({
      items: state.items,
      increaseQuantity: state.increaseQuantity,
      decreaseQuantity: state.decreaseQuantity,
      removeItem: state.removeItem,
    }));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const primaryColor = landing?.colourCode || "#3b82f6";

  const getCartSummaryMessage = () => {
    if (!items.length) return "My cart is empty.";

    const lines = items.map(
      (item, index) =>
        `${index + 1}. ${item.name} — Qty: ${item.quantity} x ${
          item.price
        } Ks = ${item.price * item.quantity} Ks`
    );

    const total = items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    lines.push(`\nTotal: ${total} Ks`);
    return `Hello Admin,\nI would like to order:\n\n${lines.join("\n")}`;
  };

  const encodedMsg = encodeURIComponent(getCartSummaryMessage());
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">🛒 Your Cart</h1>
        <p className="text-gray-500 mt-1">Review and confirm your order</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-12">
          Your cart is empty.
        </div>
      ) : (
        <>
          {/* Item List */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.price} Ks x {item.quantity} ={" "}
                      <span className="font-medium text-gray-800">
                        {formatPrice(item.price * item.quantity)} Ks
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQuantity(item._id)}
                      className="w-8 h-8 text-lg bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="min-w-[30px] text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item._id)}
                      className="w-8 h-8 text-lg bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0">
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total Summary */}
          <div className="flex justify-end items-center border-t pt-4">
            <span className="text-lg font-semibold text-gray-800">
              Total: {formatPrice(totalAmount)} Ks
            </span>
          </div>

          {/* Order Now Button (Outline style + dynamic color) */}
          <div className="pt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full border-2 font-semibold text-lg py-3 rounded-lg shadow-md transition"
              style={{
                color: primaryColor,
                borderColor: primaryColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = primaryColor;
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = primaryColor;
              }}
            >
              Order Now
            </button>
          </div>

          {/* Contact Options (using dynamic color) */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Or Contact Us Directly
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {[
                {
                  icon: <WhatsappLogo size={20} weight="fill" />,
                  label: "WhatsApp",
                  href: `https://wa.me/959123456789?text=${encodedMsg}`,
                },
                {
                  icon: <TelegramLogo size={20} weight="fill" />,
                  label: "Telegram",
                  href: `https://t.me/your_telegram_username?text=${encodedMsg}`,
                },
                {
                  icon: <EnvelopeSimple size={20} weight="fill" />,
                  label: "Email",
                  href: `mailto:admin@example.com?subject=Order Request&body=${encodedMsg}`,
                },
                {
                  icon: <ChatCircleDots size={20} weight="fill" />,
                  label: "Viber",
                  href: `viber://forward?text=${encodedMsg}`,
                },
                {
                  icon: <LineSegment size={20} weight="fill" />,
                  label: "LINE",
                  href: `https://line.me/R/msg/text/?${encodedMsg}`,
                },
              ].map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border-2 px-4 py-2 rounded-lg shadow transition"
                  style={{
                    color: primaryColor,
                    borderColor: primaryColor,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = primaryColor;
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = primaryColor;
                  }}
                >
                  {icon} {label}
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Confirm Modal */}
      {isModalOpen && (
        <ConfirmModal
          acceptPaymentTypes={landing?.acceptPaymentTypes}
          message={getCartSummaryMessage()}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Cart;
