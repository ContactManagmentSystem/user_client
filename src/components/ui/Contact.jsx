/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  TelegramLogo,
  EnvelopeSimple,
  ChatCircleDots,
  MessengerLogo,
  X,
} from "phosphor-react";
import useLandingStore from "../../store/LandingStore";

const contacts = [
  {
    label: "Phone",
    icon: Phone,
    value: "+1234567890",
    href: "tel:+1234567890",
  },
  {
    label: "Telegram",
    icon: TelegramLogo,
    value: "@telegramuser",
    href: "https://t.me/telegramuser",
  },
  {
    label: "Email",
    icon: EnvelopeSimple,
    value: "email@example.com",
    href: "mailto:email@example.com",
  },
  {
    label: "Viber",
    icon: ChatCircleDots,
    value: "+1234567890",
    href: "viber://chat?number=%2B1234567890",
  },
  {
    label: "Messenger",
    icon: MessengerLogo,
    value: "messengerUser",
    href: "https://m.me/messengerUser",
  },
];

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

const ContactToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const landingData = useLandingStore((state) => state.landingData);
  const primaryColor = landingData?.colourCode || "#3b82f6";

  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="contact-list"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-end mb-3 origin-bottom"
          >
            {contacts.map(({ label, icon: IconComp, href }, i) => (
              <motion.a
                key={label}
                custom={i}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={itemVariants}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 mb-3 overflow-hidden"
              >
                <div
                  className="shadow-md rounded-full px-4 py-2 w-40 text-sm font-medium truncate transition cursor-pointer"
                  style={{
                    backgroundColor: "#f8fafc",
                    color: primaryColor,
                    border: `1px solid ${primaryColor}`,
                  }}
                >
                  {label}
                </div>
                <div
                  className="w-12 h-12 rounded-full shadow-md flex items-center justify-center"
                  style={{ backgroundColor: primaryColor }}
                >
                  <IconComp size={28} weight="fill" className="text-white" />
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-4 text-white shadow-lg flex items-center justify-center focus:outline-none"
        aria-label={isOpen ? "Close contacts" : "Open contacts"}
        initial={{ scale: 1 }}
        animate={{
          rotate: isOpen ? 90 : 0,
          backgroundColor: isOpen ? "#dc2626" : primaryColor,
        }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? (
          <X size={28} weight="bold" />
        ) : (
          <MessengerLogo size={28} weight="fill" />
        )}
      </motion.button>
    </div>
  );
};

export default ContactToggle;
