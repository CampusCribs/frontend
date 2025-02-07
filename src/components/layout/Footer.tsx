import { CircleUserRound, Home, LogOut, Menu, Settings } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import * as motion from "motion/react-client";
import { useNavigate } from "react-router";

const pages = [
  { title: "Browse", icon: <Home />, link: "/" },
  { title: "Profile", icon: <CircleUserRound />, link: "/" },
  { title: "Settings", icon: <Settings />, link: "/" },
  { title: "Logout", icon: <LogOut />, link: "/" },
];

const Footer = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="relative border-b">
      {/* Menu Button - Always Visible */}
      <div
        className="bg-amber-900 rounded-full w-20 shadow-2xl h-20 flex items-center justify-center  mb-5 ml-5"
        onClick={() => setOpen(!open)}
      >
        <Menu size={32} />
      </div>

      {/* Overlay & Animated Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0, x: -50, y: 50 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              y: 4,
              transition: { duration: 0.1 },
            }}
            exit={{ opacity: 0, scale: 0, x: -50, y: 50 }}
            key="box"
            className="absolute bottom-0 left-0 bg-amber-900 h-[300px] w-[200px] rounded-xl rounded-bl-none flex items-center justify-center text-left flex-col shadow-lg"
            onClick={() => setOpen(false)}
          >
            <div>
              {pages.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row mx-4 my-4  text-left "
                  onClick={() => navigate(item.link)}
                >
                  <p className="mr-2 hover:cursor-pointer">{item.icon}</p>
                  <p className="hover:cursor-pointer">{item.title}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Footer;
