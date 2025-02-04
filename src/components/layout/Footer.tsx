import { Home, Menu } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import * as motion from "motion/react-client";
const pages = [
  { title: "Browse", icon: <Home /> },
  { title: "Profile", icon: <Home /> },
  { title: "Settings", icon: <Home /> },
  { title: "Logout", icon: <Home /> },
];
const Footer = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky bottom-0 left-0 ">
      <div
        className={`bg-amber-900 rounded-full w-20 shadow-2xl h-20 flex items-center justify-center mb-5 ml-5 ${
          open ? "hidden" : "flex"
        }`}
      >
        <a onClick={() => setOpen(!open)}>
          <Menu size={32} />
        </a>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            onClick={() => setOpen(false)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.1 } }}
            exit={{ opacity: 0, scale: 0 }}
            key="box"
            className="sticky bottom-0 left-0 bg-amber-900 h-[300px] w-[200px] rounded-xl rounded-bl-none flex items-center justify-center flex-col"
          >
            {pages.map((item, index) => (
              <a
                key={index}
                className="flex flex-row mx-2 my-1 hover:cursor-pointer"
              >
                <p>{item.icon}</p>
                <p>{item.title}</p>
              </a>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Footer;
