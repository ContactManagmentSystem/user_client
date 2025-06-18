import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessengerLogo, X } from "phosphor-react";
import {
  Facebook,
  Instagram,
  Twitter,
  Telegram,
  WhatsApp,
  YouTube,
  LinkedIn,
  Email,
  Phone,
  Link as LinkIcon,
} from "@mui/icons-material";

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

// Icon resolver using string inclusion
const resolveIcon = (iconName) => {
  const name = iconName?.toLowerCase() || "";

  if (name.includes("facebook")) return Facebook;
  if (name.includes("instagram")) return Instagram;
  if (name.includes("twitter")) return Twitter;
  if (name.includes("telegram")) return Telegram;
  if (name.includes("whatsapp")) return WhatsApp;
  if (name.includes("youtube")) return YouTube;
  if (name.includes("linkedin")) return LinkedIn;
  if (name.includes("email") || name.includes("mail")) return Email;
  if (name.includes("phone") || name.includes("tel")) return Phone;

  return LinkIcon;
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
                      fontSize="medium"
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
