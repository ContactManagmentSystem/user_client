/* eslint-disable react/prop-types */
import { useState } from "react";
import { useManageStore } from "../../store/useManageStore";
import {
  WhatsappLogo,
  TelegramLogo,
  EnvelopeSimple,
  ChatCircleDots,
  LineSegment,
  PhoneCall,
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
  Globe,
  Trash,
} from "phosphor-react";
import ConfirmModal from "./components/ConfirmModal";
import { redirectToContact } from "../../lib/contact";
import { Divider } from "antd";

const formatPrice = (num) => new Intl.NumberFormat("en-US").format(num);

// Define all supported icons
const collectedIcons = [
  { key: "whatsapp", icon: <WhatsappLogo size={20} weight="fill" /> },
  { key: "telegram", icon: <TelegramLogo size={20} weight="fill" /> },
  { key: "email", icon: <EnvelopeSimple size={20} weight="fill" /> },
  { key: "mail", icon: <EnvelopeSimple size={20} weight="fill" /> },
  { key: "viber", icon: <ChatCircleDots size={20} weight="fill" /> },
  { key: "line", icon: <LineSegment size={20} weight="fill" /> },
  { key: "phone", icon: <PhoneCall size={20} weight="fill" /> },
  { key: "call", icon: <PhoneCall size={20} weight="fill" /> },
  { key: "facebook", icon: <FacebookLogo size={20} weight="fill" /> },
  { key: "instagram", icon: <InstagramLogo size={20} weight="fill" /> },
  { key: "twitter", icon: <TwitterLogo size={20} weight="fill" /> },
  { key: "website", icon: <Globe size={20} weight="fill" /> },
];

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

  // Cart summary message that includes item details
  const getCartSummaryMessage = () => {
    if (!items.length) return "My cart is empty.";

    const lines = items.map((item, index) => {
      const discount = item.discountPrice || 0;
      const sellingPrice = item.price - discount; // Use price minus discount
      const itemTotal = sellingPrice * item.quantity;
      return `${index + 1}. ${item.name} — Qty: ${
        item.quantity
      } x ${sellingPrice} ${landing?.currency} = ${itemTotal} ${
        landing?.currency
      }`;
    });

    const total = items.reduce((acc, item) => {
      const discount = item.discountPrice || 0;
      const sellingPrice = item.price - discount;
      return acc + item.quantity * sellingPrice;
    }, 0);

    lines.push(`\nTotal: ${formatPrice(total)} ${landing?.currency}`);
    return `Hello Admin,\nI would like to order:\n\n${lines.join("\n")}`;
  };

  const encodedMsg = encodeURIComponent(getCartSummaryMessage());

  // Calculate the total amount based on selling price
  const totalAmount = items.reduce((sum, item) => {
    const discount = item.discountPrice || 0;
    const sellingPrice = item.price - discount; // Use price minus discount
    return sum + item.quantity * sellingPrice;
  }, 0);

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
            {items.map((item) => {
              const discount = item.discountPrice || 0;
              const sellingPrice = item.price - discount; // Use price minus discount
              const itemTotal = sellingPrice * item.quantity;

              return (
                <div
                  key={item._id}
                  className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {sellingPrice} {landing?.currency} x {item.quantity} ={" "}
                        <span className="font-medium text-gray-800">
                          {formatPrice(itemTotal)} {landing?.currency}
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
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-600 hover:text-red-800 transition"
                    aria-label="Remove item"
                  >
                    <Trash size={20} weight="bold" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Total Summary */}
          <div className="flex justify-end items-center border-t pt-4">
            <span className="text-lg font-semibold text-gray-800">
              Total: {formatPrice(totalAmount)} {landing?.currency}
            </span>
          </div>

          {/* Order Now Button */}
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

          {/* Dynamic Contact Options */}
          {landing?.socialLinks?.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Or Contact Us Directly
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {landing.socialLinks.map((el) => {
                  const match = collectedIcons.find((entry) =>
                    el.icon?.toLowerCase().includes(entry.key)
                  );
                  if (!match) return null;

                  let contactLink = el.link;
                  if (
                    contactLink.startsWith("http") &&
                    !contactLink.startsWith("mailto") &&
                    !contactLink.startsWith("tel")
                  ) {
                    contactLink += `?text=${encodedMsg}`;
                  }

                  return (
                    <button
                      key={el.name}
                      onClick={() => redirectToContact(contactLink)}
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
                      {match.icon} {el.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirm Modal */}
      {isModalOpen && (
        <ConfirmModal
          acceptPaymentTypes={landing?.acceptPaymentTypes}
          message={getCartSummaryMessage()}
          onClose={() => setIsModalOpen(false)}
          landing={landing}
        />
      )}
    </div>
  );
};

export default Cart;
