import {
  CirclePlus,
  CircleUserRound,
  Home,
  LogIn,
  Menu,
  Settings,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import * as motion from "motion/react-client";
import { useNavigate } from "react-router";

const pages = [
  { title: "Browse", icon: <Home />, link: "/" },
  { title: "Post", icon: <CirclePlus />, link: "/post" },
  { title: "Profile", icon: <CircleUserRound />, link: "/profile" },
  { title: "Settings", icon: <Settings />, link: "/settings" },
  { title: "LogIn", icon: <LogIn />, link: "/login" },
];

const Footer = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-10"
          onClick={() => setOpen(false)}
        ></div>
      )}
      <div className="relative border-b">
        {/* Menu Button - Always Visible */}
        <div
          className="bg-black rounded-full w-20 shadow-2xl h-20 flex items-center justify-center  mb-5 ml-5"
          onClick={() => setOpen(!open)}
        >
          <Menu color="white" size={40} />
        </div>

        {/* Overlay & Animated Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0, x: -50, y: 50 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 20,
                y: -20,
                transition: { duration: 0.1 },
              }}
              exit={{ opacity: 0, scale: 0, x: -50, y: 50 }}
              key="box"
              className="absolute bottom-0 left-0 bg-black h-[300px] w-[200px] rounded-xl rounded-bl-none flex items-center text-white justify-center text-left flex-col shadow-lg z-50"
              onClick={() => setOpen(false)}
            >
              <div>
                {pages.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-row mx-4 my-4  text-left "
                    onClick={() => navigate(item.link)}
                  >
                    <div className="mr-2 cursor-pointer">{item.icon}</div>
                    <div className="cursor-pointer">{item.title}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Footer;
