import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FacebookLogo,
  TwitterLogo,
  InstagramLogo,
  LinkedinLogo,
  WhatsappLogo,
  Envelope,
  Phone,
  TelegramLogo,
  MessengerLogo,
  YoutubeLogo,
  Link,
  X,
} from "phosphor-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLine, faViber } from "@fortawesome/free-brands-svg-icons"; // Correct import

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

// Resolve icon based on the name of the platform
const resolveIcon = (iconName) => {
  const name = iconName?.toLowerCase() || "";

  if (name.includes("facebook")) return { type: 'phosphor', component: FacebookLogo };
  if (name.includes("instagram")) return { type: 'phosphor', component: InstagramLogo };
  if (name.includes("twitter")) return { type: 'phosphor', component: TwitterLogo };
  if (name.includes("linkedin")) return { type: 'phosphor', component: LinkedinLogo };
  if (name.includes("whatsapp")) return { type: 'phosphor', component: WhatsappLogo };
  if (name.includes("email")) return { type: 'phosphor', component: Envelope };
  if (name.includes("phone")) return { type: 'phosphor', component: Phone };
  if (name.includes("line")) return { type: 'fontawesome', component: faLine };
  if (name.includes("send")) return { type: 'phosphor', component: Link };
  if (name.includes("messenger")) return { type: 'phosphor', component: MessengerLogo };
  if (name.includes("telegram")) return { type: 'phosphor', component: TelegramLogo };
  if (name.includes("youtube")) return { type: 'phosphor', component: YoutubeLogo };
  if (name.includes("viber")) return { type: 'fontawesome', component: faViber };

  return { type: 'phosphor', component: TelegramLogo }; // Default fallback to Telegram logo
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
              const { type, component: IconComponent } = resolveIcon(icon);

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
                    {type === "fontawesome" ? (
                      // Render FontAwesomeIcon for FontAwesome icons (faLine, faViber)
                      <FontAwesomeIcon
                        icon={IconComponent} // Pass the icon object to FontAwesomeIcon component
                        style={{ color: "#fff", fontSize: "24px" }}
                      />
                    ) : (
                      // Render Phosphor React icons directly
                      <IconComponent
                        style={{ color: "#fff" }}
                        size={24} // Adjusted size for consistency
                      />
                    )}
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
