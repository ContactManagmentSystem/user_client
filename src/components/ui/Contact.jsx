import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessengerLogo,
  X,
  TelegramLogo,
  FacebookLogo,
  TwitterLogo,
  InstagramLogo,
  LinkedinLogo,
  WhatsappLogo,
  Envelope,
  Phone,
  Chat,
  Link,
} from "phosphor-react";

import useLandingStore from "../../store/LandingStore";
import { useGetLanding } from "../../api/hooks/useQuery";
import { redirectToContact } from "../../lib/contact";

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
  exit: { opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } },
};

const resolveIcon = (iconName) => {
  const name = iconName?.toLowerCase() || "";
  console.log(name);

  if (name.includes("facebook")) return FacebookLogo;
  if (name.includes("instagram")) return InstagramLogo;
  if (name.includes("twitter")) return TwitterLogo;
  if (name.includes("linkedin")) return LinkedinLogo;
  if (name.includes("whatsapp")) return WhatsappLogo;
  if (name.includes("email")) return Envelope;
  if (name.includes("phone")) return Phone;
  if (name.includes("line")) return Chat;
  if (name.includes("send")) return Link;
  if (name.includes("messenger")) return MessengerLogo; // Added Messenger
  if (name.includes("telegram")) return TelegramLogo; // Added Telegram

  return TelegramLogo;
};

const ContactToggle = () => {
  const { data: landing } = useGetLanding();
  const [isOpen, setIsOpen] = useState(false);
  const landingData = useLandingStore((state) => state.landingData);
  const primaryColor = landingData?.colourCode || "#3b82f6";
  const socialLinks = landing?.data?.socialLinks || [];

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
            {socialLinks.map(({ name, link, icon }, i) => {
              const IconComponent = resolveIcon(icon);

              return (
                <motion.div
                  key={name + i}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={itemVariants}
                  onClick={() => redirectToContact(link)}
                  className="flex items-center gap-3 mb-3 overflow-hidden cursor-pointer"
                >
                  <div
                    className="shadow-md rounded-full px-4 py-2 w-40 text-sm font-medium truncate transition"
                    style={{
                      backgroundColor: "#f8fafc",
                      color: primaryColor,
                      border: `1px solid ${primaryColor}`,
                    }}
                  >
                    {name}
                  </div>
                  <div
                    className="w-12 h-12 rounded-full shadow-md flex items-center justify-center"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <IconComponent
                      style={{ color: "#fff" }}
                      size={24} // Adjusted size for consistency
                    />
                  </div>
                </motion.div>
              );
            })}
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
